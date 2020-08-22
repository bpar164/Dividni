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
import { ExamsDTO } from './exams.dto';

@Injectable()
export class ExamsService {
    constructor(@InjectModel(Exams.name) private ExamsModel: Model<Exams>, @InjectModel(MultipleChoice.name) private MCModel: Model<MultipleChoice>) {}

    /* Check for required inputs and types etc.
    Just returns false if there is an issue, without explanation.
    Validation also performed on frontend, so this is only false when the user has somehow avoided the frontend. */
    validateExam(form: ExamFormDTO): boolean {
        //Name and paper count are required 
        if ((!(form.name)) || (!(form.paperCount))) {
            return false;
        }
         //Field types are all correct
         if ((typeof(form.name) !== 'string') ||
         (typeof(form.paperCount) !== 'string') ||
         (typeof(form.coverPage) !== 'string') ||
         (typeof(form.appendix) !== 'string') 
        ) {
            return false;
        }
        //questionLists can not exist - need to check this before checking type
        if (form.mcQuestionList) {
            if (typeof(form.mcQuestionList) !== 'object') {
                return false;
            }
        }
        if (form.advQuestionList) {
            if (typeof(form.advQuestionList) !== 'object') {
                return false;
            }
        }
        //There must be at least one question
        if ((form.mcQuestionList.length < 1) && (form.advQuestionList.length < 1)) {
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
        return true;
    }

    //Create the Dividni exam
    async generateExam(exam: ExamFormDTO, id: string): Promise<any> {
        //String for holding the html with question ids
        let questionHTML = `<div id="Questions"><ol class="qlist">`;
        //Convert all multiple-choice questions to xml
        let mcXML: Array<String> = [];
        if (exam.mcQuestionList) {
            for (let i = 0; i < exam.mcQuestionList.length; i++) {
                //Fetch mc question by id
                let multipleChoice = await this.MCModel.findById(exam.mcQuestionList[i]);
                //Save the question into a separate variable
                let question = new QuestionFormDTO;
                Object.keys(multipleChoice.question).map(key => question[key] = multipleChoice.question[key]);
                //Convert question to xml and save to array
                mcXML.push(this.convertToXML(question, 'MC' + i));  
                //Add the question ID to the list in the HTML
                questionHTML += `<li class="q"><p class="cws_code_q">MC` + i + `</p></li>`;
            }
        }
        //Close the questionHTML string
        questionHTML += `</ol></div>`;
        //Do not include coverPage/appendix if they are empty
        if (exam.coverPage === '') {
            console.log('Do not generate cover page');
        }
        if (exam.appendix === '') {
            console.log('Do not generate appendix');
        }
        //Create the actual exam files
        let result = await this.createExam();
        if (result === true) {
            //Save exam settings to database
            /*let userID = id; 
            let examsDTO = new ExamsDTO();
            examsDTO = { exam, userID };
            let newExam = new this.ExamsModel(examsDTO);
            return newExam.save(); */
            return true;
        } else {
            return false;
        }    
    } 

    //Convert multiple-choice question to XML format
    convertToXML(question: QuestionFormDTO, id) {
        const root = create()
            .ele('Question', {type: question.type, id: id, marks: question.marks}) 
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

    async createExam(): Promise<any> {
        let status;
         //Create a temporary folder to hold the exam
         status = this.makeFolder('../temp');

         return status;
        /*
        //Create the question files, from the XML content
        fs.writeFile('../exam/question.xml', xml, (err) => {
            if (err) {
                this.setErrorDetails(err);
            }
        });
        
         //Generate the C# and HTML files
        await this.execShellCommand(`cd .. && cd question && mono "..\\dividni\\XmlQuest.exe" question.xml`);
        //Retrieve the new files
        let html = await this.readFile('../question/question.htm');
        let code = await this.readFile('../question/question.cs');
        
        //Delete the folder and its contents
        await this.execShellCommand(`cd .. && rmdir /Q /S question`);*/
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

    //Run a given shell command, asynchronously 
    execShellCommand(cmd: string): Promise<any> {
        return new Promise((resolve) => {
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    return false;
                }
            resolve(stdout? stdout : stderr);
            });
        });
    }

    readFile(path: string): Promise<any> {
        return new Promise((resolve) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    return false;
                } 
            resolve(data);
            });
        });
    }

    async fetchUserExams(userID: string) {  
        return this.ExamsModel.find({ userID: userID }).sort({$natural:-1}).exec();
    }
}

