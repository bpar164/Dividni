import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import fs = require('fs');
import { exec } from 'child_process';


let errorDetails = { status: false, message: '' };

@Injectable()
export class ExamsService {
    constructor() {}

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

