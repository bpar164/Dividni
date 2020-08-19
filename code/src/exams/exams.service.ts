import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import fs = require('fs');
import { exec } from 'child_process';
import { create } from 'xmlbuilder2';
import { ExamFormDTO } from './exam-form.dto';
import { Exams } from './exams.schema';


let errorDetails = { status: false, message: '' };

@Injectable()
export class ExamsService {
    constructor(@InjectModel(Exams.name) private MCModel: Model<Exams>) {}

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

    //Create the Dividni rxam
    async generateQuestion(exam: ExamFormDTO, id: string): Promise<any> {
        //Do not include coverPage/appendix if they are empty
        if (exam.coverPage === '') {
            console.log('Do not generate cover page');
        }
        if (exam.appendix === '') {
            console.log('Do not generate appendix');
        }
        /*let userID = id; 
        //Save question to database
        let multipleChoiceDTO = new MultipleChoiceDTO();
        multipleChoiceDTO = { question, userID };
        let newQuestion = new this.MCModel(multipleChoiceDTO);
        return newQuestion.save();*/    
    } 

    /*
    //Convert multiple-choice question to XML
    convertToXML(form: QuestionFormDTO) {
        const root = create()
            .ele('Question', {type: form.type, id: 'id', marks: form.marks}) //Id is just 'id' - value is not used at all.
                .ele('Stem').txt(form.questionText).up();
        const trueAnswers = root.ele('TrueAnswers');
        for (let i = 0; i < form.correctAnswers.length; i++) {
            trueAnswers.ele('Answer').txt(form.correctAnswers[i]).up()
        }    
        trueAnswers.up();       
        const falseAnswers = root.ele('FalseAnswers');
        for (let i = 0; i < form.incorrectAnswers.length; i++) {
            falseAnswers.ele('Answer').txt(form.incorrectAnswers[i]).up()
        }    
        falseAnswers.up();     

        return root.end({ prettyPrint: true });
    }*/

    async createExam(): Promise<any> {
        //Create a temporary folder to hold the exam
        fs.mkdir('../exam', (err) => {
            if (err) {
                this.setErrorDetails(err);
            } 
        });

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
        await this.execShellCommand(`cd .. && rmdir /Q /S question`);
        
        //Return the result
        return new Promise(resolve => {
            resolve(errorDetails);
        });
        */
    }

    //Function to set the values of the errorDetails object
    setErrorDetails(err) {
        errorDetails.status = true;
        errorDetails.message = err.message;
    }

    //Run a given shell command, asynchronously 
    execShellCommand(cmd: string): Promise<any> {
        return new Promise((resolve) => {
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    this.setErrorDetails(err);
                }
            resolve(stdout? stdout : stderr);
            });
        });
    }

    readFile(path: string): Promise<any> {
        return new Promise((resolve) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    this.setErrorDetails(err);
                } 
            resolve(data);
            });
        });
    }
}

