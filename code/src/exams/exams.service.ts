import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import fs = require('fs');
import { exec } from 'child_process';
import { create } from 'xmlbuilder2';


let errorDetails = { status: false, message: '' };

@Injectable()
export class ExamsService {
    constructor() {}

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

