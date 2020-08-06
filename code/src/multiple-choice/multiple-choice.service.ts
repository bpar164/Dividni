import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MultipleChoice } from './multiple-choice.schema';
import { QuestionFormDTO } from './question-form.dto';
import { MultipleChoiceDTO } from './multiple-choice.dto';

@Injectable()
export class MultipleChoiceService {
    private QuestionMode: { id: string, action: string };
    constructor(@InjectModel(MultipleChoice.name) private MCModel: Model<MultipleChoice>) {}

    //Remove all empty string elements
    removeEmptyElements(array: string[]) {
        return array.filter((i) => {return i != '';});
    }

    /* Check for required inputs and types etc.
    Just returns false if there is an issue, without explanation.
    Validation also performed on frontend, so this is only false when the user has somehow avoided the frontend. */
    validateQuestion(form: QuestionFormDTO): boolean {
        //Fields are present
        if ((!(form.name)) || (!(form.type)) || (!(form.marks)) || (!(form.questionText)) || (!(form.correctAnswers)) || (!(form.incorrectAnswers))) {
            return false;
        }
        //Field types are all correct
        if ((typeof(form.name) !== 'string') ||
            (typeof(form.type) !== 'string') ||
            (typeof(form.marks) !== 'string') ||
            (typeof(form.questionText) !== 'string') ||
            (typeof(form.correctAnswers) !== 'object') ||
            (typeof(form.incorrectAnswers) !== 'object')
        ) {
            return false;
        }
        //Name matches regular expression
        const re = new RegExp("^[a-zA-Z0-9][a-zA-Z0-9 ]*");
        if (!(re.test(form.name))) {
            return false;
        } 
        //Type = Truth or Xyz
        if ((form.type !== 'Truth') && (form.type !== 'Xyz')) {
            return false;
        }
        //Marks in [0, 10] and divisible by 0.5
        let marks = parseFloat(form.marks);
        if (isNaN(marks)) {
            return false;
        } else if (!((marks >= 0) && (marks <= 10))) {
            return false;
        } else if ((marks % 0.5) !== 0) {
            return false;
        }
        //Based on Type, check if length of correctAnswers and incorrectAnswers is sufficient
        const minCorrectTruth = 1;
        const minIncorrectTruth = 4;
        const minCorrectXYZ = 3;
        const minIncorrectXYZ = 3;
        if (form.type === 'Truth') {
            if (form.correctAnswers.length < minCorrectTruth) return false;
            if (form.incorrectAnswers.length < minIncorrectTruth) return false;
        } else if (form.type === 'Xyz') {
            if (form.correctAnswers.length < minCorrectXYZ) return false;
            if (form.incorrectAnswers.length < minIncorrectXYZ) return false;
        }
        return true;
    }
    
    //Create the Dividni question 
    async generateQuestion(question: QuestionFormDTO, id: string): Promise<any> {
        let userID = id; 
        //Save question to database
        let multipleChoiceDTO = new MultipleChoiceDTO();
        multipleChoiceDTO = {question, userID };
        let newQuestion = new this.MCModel(multipleChoiceDTO);
        return newQuestion.save();    
    } 

    async fetchUserQuestions(userID: string) {  
        return this.MCModel.find({ userID: userID }).sort({$natural:-1}).exec();
    }

    async getQuestion(id: string) {  
        return this.MCModel.findOne({ _id: id }, '-_id').exec();
    }

    async deleteQuestion(id: string) {  
        return this.MCModel.findByIdAndDelete({ _id: id }).exec();
    }

    async updateQuestion(id: string, question) {
        return this.MCModel.updateOne({ _id: id}, {question: question}).exec();
    }

    getQuestionMode() {
        return this.QuestionMode;
    }

    setQuestionMode(questionID : string, questionAction: string) {
        let id = questionID;
        let action = questionAction;
        this.QuestionMode = { id, action };
    }
}
