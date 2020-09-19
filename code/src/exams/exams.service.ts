import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import fs = require('fs');
import { exec } from 'child_process';
import { create } from 'xmlbuilder2';
import { ExamFormDTO } from './exam-form.dto';
import { Exams } from './exams.schema';
import { QuestionFormDTO } from '../multiple-choice/question-form.dto';
import { MultipleChoice } from '../multiple-choice/multiple-choice.schema';
import { QuestionDTO } from './question.dto';
import { ExamsDTO } from './exams.dto';

let examCSS =
    `
    body {
        font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
    }
         
    ol.qlist > li.q {
        margin: 2em 0;
    }

    li > ol.a {
        list-style: upper-alpha;
    }
         
    .xyz {
        padding-top: 1em;
        padding-bottom: 1em;
    }
    `;

@Injectable()
export class ExamsService {
    constructor(@InjectModel(Exams.name) private ExamsModel: Model<Exams>, @InjectModel(MultipleChoice.name) private MCModel: Model<MultipleChoice>) { }

    /* Check for required inputs and types etc.
    Just returns false if there is an issue, without explanation.
    Validation also performed on frontend, so this is only false when the user has somehow avoided the frontend. */
    validateExam(form: ExamFormDTO): boolean {
        //Name, paper count and type are required 
        if ((!(form.name)) || (!(form.paperCount)) || (!(form.examType))) {
            return false;
        }
        //Field types are all correct
        if ((typeof (form.name) !== 'string') ||
            (typeof (form.paperCount) !== 'string') ||
            (typeof (form.examType) !== 'string') ||
            (typeof (form.coverPage) !== 'string') ||
            (typeof (form.questionList) !== 'object') ||
            (typeof (form.appendix) !== 'string')
        ) {
            return false;
        }
        //There must be at least one question
        if (form.questionList.length < 1) {
            return false;
        }
        //Name matches regular expression
        const re = new RegExp("^[a-zA-Z0-9][a-zA-Z0-9 ]*");
        if (!(re.test(form.name))) {
            return false;
        }
        //paperCount in [1, 100] and divisible by 1
        let paperCount = parseFloat(form.paperCount);
        if (isNaN(paperCount)) {
            return false;
        } else if (!((paperCount >= 1) && (paperCount <= 100))) {
            return false;
        } else if ((paperCount % 1) !== 0) {
            return false;
        }
        //examType can only have 3 options
        let examType = form.examType;
        if (!((examType === 'standard') || (examType === 'canvas') || (examType === 'inspera'))) {
            return false;
        }
        return true;
    }

    //Create the Dividni exam
    async generateExam(exam: ExamFormDTO, id: string): Promise<any> {
        //String for holding the html with question ids and instruction sections
        let questionHTML = `<div id="Questions"><ol class="qlist">`;
        //Convert all questions to xml, and create html question list
        let questionXML: Array<String> = [];
        for (let i = 0; i < exam.questionList.length; i++) {
            //Create the question object 
            let question = new QuestionDTO;
            Object.keys(exam.questionList[i]).map(key => question[key] = exam.questionList[i][key]);
            //Generate xml for questions
            if (question.type === 'mc') {
                //Fetch question by id
                let multipleChoice = await this.MCModel.findById(question.id);
                //Save the question into a separate variable
                let mcQuestion = new QuestionFormDTO;
                Object.keys(multipleChoice.question).map(key => mcQuestion[key] = multipleChoice.question[key]);
                //Convert question to xml and save to array
                questionXML.push(this.convertToXML(mcQuestion, 'Q' + i));
                //Add the question ID to the list in the HTML
                questionHTML += `<li class="q"><p class="cws_code_q">Q` + i + `</p></li>`;
            } else {
                questionHTML += question.contents;
            }
        }
        //Close the questionHTML string
        questionHTML += `</ol></div>`;
        //Create the actual exam files
        let result = await this.createExam(exam, questionXML, questionHTML);
        if (result === true) {
            //Save exam settings to database
            let userID = id;
            let examsDTO = new ExamsDTO();
            examsDTO = { exam, userID };
            let newExam = new this.ExamsModel(examsDTO);
            return newExam.save();
        } else {
            return false;
        }
    }

    //Convert multiple-choice question to XML format
    convertToXML(question: QuestionFormDTO, id) {
        const root = create()
            .ele('Question', { type: question.type, id: id, marks: question.marks })
            .ele('Stem').txt(question.questionText).up();
        const trueAnswers = root.ele('TrueAnswers');
        for (let i = 0; i < question.correctAnswers.length; i++) {
            trueAnswers.ele('Answer').txt(question.correctAnswers[i]).up()
        }
        trueAnswers.up();
        const falseAnswers = root.ele('FalseAnswers');
        for (let i = 0; i < question.incorrectAnswers.length; i++) {
            falseAnswers.ele('Answer').txt(question.incorrectAnswers[i]).up()
        }
        falseAnswers.up();
        return root.end({ prettyPrint: true });
    }

    //Uses the Dividni tools to create the question and exam files
    async createExam(exam, questionXML, questionHTML): Promise<any> {
        let success;
        let continueLoop;
        let fileList = [];
        let path = process.cwd();
        path = path.substring(0, path.length - 5) + `\\` + exam.name + `\\papers`; //Remove \code from path
        //Stop executing if any of the actions fail
        while (continueLoop != false) {
            success = false;
            let questionList = "";
            //Create a temporary folder to hold the exam
            continueLoop = await this.makeFolder(`../` + exam.name);
            //Create a file for each question and then convert it to C#
            for (let i = 0; i < questionXML.length; i++) {
                //Create the xml files
                continueLoop = await this.makeFile(`../` + exam.name + `/Q` + i + `.xml`, questionXML[i]);
                //Generate the C# and HTML files
                continueLoop = await this.execShellCommand(`cd .. && cd ` + exam.name + ` && mono "..\\dividni\\XmlQuest.exe" Q` + i + `.xml`);
                //Add file to list to be compiled
                questionList += " Q" + i + '.cs';
            }
            //Create standard exam with html template
            if (exam.examType === 'standard') {
                //Compile all of the questions
                continueLoop = await this.execShellCommand(`cd .. && cd ` + exam.name + ` && mcs -t:library -lib:"..\\dividni" -r:Utilities.Courses.dll -out:QHelper.dll` + questionList);
                //Create html template
                //Header with name
                let examHTML = `<html><head><meta charset="utf-8"/><title>` + exam.name + `</title><style>` + examCSS + `</style></head><body>`;
                //Cover page
                exam.coverPage !== '' ? examHTML += `<div id="coverPage">` + exam.coverPage + `</div><p style="page-break-after: always;" />` : null;
                //Questions
                examHTML += `<div id="questions">` + questionHTML + `</div>`;
                //Appendix
                exam.appendix !== '' ? examHTML += `<p style="page-break-before: always;" /><div id="appendix">` + exam.appendix + `</div></body></html>` : examHTML += `</body></html>`;
                //Create a file for the html
                continueLoop = await this.makeFile(`../` + exam.name + `/Exam.Template.html`, examHTML);
                //Generate exam
                continueLoop = await this.execShellCommand(`cd .. && cd ` + exam.name + ` && mono "..\\dividni\\TestGen.exe" -lib QHelper.dll -htmlFolder papers -answerFolder answers -paperCount ` + exam.paperCount + ` Exam.Template.html`);
                //Convert all html question files in the papers folder to pdf
                continueLoop = await this.convertFilesToPDF(`../` + exam.name + `/papers`, exam.name, fileList, path);
            } else if (exam.examType === 'canvas') { //Create Canvas compatible zip 
                continueLoop = await this.execShellCommand(`cd .. && cd ` + exam.name + ` && mono "..\\dividni\\QtiGen.exe" -qtiVers 1.2 -variant ` + exam.paperCount + ` -id ` + exam.name + questionList);
            } else { //Create Inspera compatible zip 
                continueLoop = await this.execShellCommand(`cd .. && cd ` + exam.name + ` && mono "..\\dividni\\QtiGen.exe" -qtiVers 2.1 -variant ` + exam.paperCount + ` -id ` + exam.name + questionList);
            }
            success = true; //Only true if reach last operation
            continueLoop = false;
        }
        return success;
    }

    convertFilesToPDF(folderPath: string, examName: string, fileList: string[], path: string): Promise<any> {
        let status;
        return new Promise((resolve) => {
            fs.readdir(folderPath, async (err, files) => {
                if (err) {
                    status = false;
                } else {
                    files.forEach(async (file) => {
                        status = await this.convertFile(file, examName, fileList, path);
                    });
                }
                resolve(status);
            });
        });
    }

    convertFile(file: string, examName: string, fileList: string[], path: string): Promise<any> {
        let status;
        return new Promise(async (resolve) => {
            let fileName = examName + '#' + file.substr(0, file.indexOf('.')) + '.pdf';
            fileList.push(path + `\\` + fileName);
            status = await this.execShellCommand(`cd .. && cd ` + examName + ` && cd papers && ..\\..\\dividni\\wkhtmltopdf ` + file + ` ` + fileName);
            resolve(status);
        });
    }

    async mergePDFs(examName: string) {
        let status = await this.execShellCommand(`cd .. && cd ` + examName + ` && cd papers && pdftk *.pdf cat output ` + examName + `.pdf`);
        return status;
    }


    async zipFolder(folderName: string) {
        let status = await this.execShellCommand(`cd .. && tar cf ` + folderName + `.zip ` + folderName);
        return status;
    }

    async deleteFolder(folderName: string) {
        let status = await this.execShellCommand(`cd .. && del ` + folderName + `.zip`); //Also remove zip
        status = await this.execShellCommand(`cd .. && rmdir /Q /S ` + folderName);
        return status;
    }

    //Make a directory 
    makeFolder(path: string): Promise<any> {
        let status;
        return new Promise((resolve) => {
            fs.mkdir(path, (err) => {
                if (err) {
                    status = false;
                } else {
                    status = true;
                }
                resolve(status);
            });
        });
    }

    //Create a file from the input  
    makeFile(path: string, contents: string): Promise<any> {
        let status;
        return new Promise((resolve) => {
            fs.writeFile(path, contents, (err) => {
                if (err) {
                    status = false;
                } else {
                    status = true;
                }
                resolve(status);
            });
        });
    }

    //Run a given shell command, asynchronously 
    execShellCommand(cmd: string): Promise<any> {
        let status;
        return new Promise((resolve) => {
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    status = false;
                } else {
                    status = true;
                }
                resolve(status);
            });
        });
    }

    async fetchUserExams(userID: string) {
        return this.ExamsModel.find({ userID: userID }).sort({ $natural: -1 }).exec();
    }

    async getExam(id: string) {
        return this.ExamsModel.findOne({ _id: id }, '-_id').exec();
    }

    async deleteExam(id: string) {
        return this.ExamsModel.findByIdAndDelete({ _id: id }).exec();
    }

}

