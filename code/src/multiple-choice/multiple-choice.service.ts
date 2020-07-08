import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MultipleChoice } from './multiple-choice.schema';
import { QuestionFormDTO } from './question-form.dto';
import { MultipleChoiceDTO } from './multiple-choice.dto';
import { create } from 'xmlbuilder2';

@Injectable()
export class MultipleChoiceService {
    constructor(@InjectModel(MultipleChoice.name) private MCModel: Model<MultipleChoice>) {}
    //Remove all empty string elements
    removeEmptyElements(array: string[]) {
        return array.filter((i) => {return i != '';});
    }

    //Convert question to XML
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
    }
    
    //Use the XML file to create the Dividni question (C#)
    async createQuestion(question: QuestionFormDTO, xml: string): Promise<any> {
        let error;
        try {
            let user: string = 'user1';
            //Save xml and question to database
            let multipleChoiceDTO = new MultipleChoiceDTO();
            multipleChoiceDTO = {question, xml, user };
            let newQuestion = new this.MCModel(multipleChoiceDTO);
            newQuestion.save();
        } catch (err) {
            error = err.name;
        }
        
        //Return the result
        return new Promise(resolve => {
            resolve(error);
        });
    } 
}
