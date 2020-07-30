import { Controller, Get, Render, Post, Req, Delete, Param, Put } from '@nestjs/common';
import { MultipleChoiceService } from './multiple-choice.service';
import { QuestionFormDTO } from './question-form.dto';
import { Request } from 'express';

@Controller()
export class MultipleChoiceController {
    constructor(private readonly multipleChoiceService: MultipleChoiceService) {}

    @Get('multiple-choice')
    @Render('multiple-choice')
    getMultipleChoiceView() { 
        let questionID = null;
        let questionAction = null;
        let questionMode = this.multipleChoiceService.getQuestionMode();
        if (questionMode) {
            questionID = questionMode.id;
            questionAction = questionMode.action;
            this.multipleChoiceService.setQuestionMode(null, null);
        } 
        return { 
            title: 'Multiple-Choice', 
            description: 'Create questions with multiple answers',
            id: questionID,
            action: questionAction
          };
    }

    @Post('multiple-choice')
    async generateQuestion(@Req() request: Request): Promise<boolean> { 
        let question = new QuestionFormDTO();
        try {
            question = request.body;
            question.correctAnswers = this.multipleChoiceService.removeEmptyElements(question.correctAnswers);
            question.incorrectAnswers = this.multipleChoiceService.removeEmptyElements(question.incorrectAnswers);
            if (this.multipleChoiceService.validateQuestion(question)) {
                await this.multipleChoiceService.generateQuestion(question);
                return true; //Question created
            } else {
                return false; //Question not created
            }
        } catch (err) {
            return false; //Question not created
        }    
    }

    @Put('multiple-choice/:id')
    async updateQuestion(@Req() request: Request, @Param('id') id): Promise<boolean> { 
        let question = new QuestionFormDTO();
        try {
            question = request.body;
            question.correctAnswers = this.multipleChoiceService.removeEmptyElements(question.correctAnswers);
            question.incorrectAnswers = this.multipleChoiceService.removeEmptyElements(question.incorrectAnswers);
            if (this.multipleChoiceService.validateQuestion(question)) {
                await this.multipleChoiceService.updateQuestion(id, question);
                return true; //Question created
            } else {
                return false; //Question not created
            }
        } catch (err) {
            return false; //Question not created
        }    
    }

    @Get('multiple-choice-my')
    @Render('multiple-choice-my') //TODO Need to add params and send user ID
    async getMultipleChoiceMyView() { 
        return { 
            title: 'Multiple-Choice', 
            description: 'Browse the multiple-choice questions that you have created',
            questions: await this.multipleChoiceService.fetchUserQuestions('user1')
          };
    }

    @Get('multiple-choice-my/:id')
    async getQuestion(@Param('id') id) {
        return await this.multipleChoiceService.getQuestion(id);
    }

    @Delete('multiple-choice-my/:id')
    async deleteQuestion(@Param('id') id) {
        await this.multipleChoiceService.deleteQuestion(id);
    }

    @Get('template-question/:id')
    templateQuestion(@Param('id') id) {
        this.multipleChoiceService.setQuestionMode(id, 'TEMPLATE');
    }

    @Get('edit-question/:id')
    editQuestion(@Param('id') id) {
        this.multipleChoiceService.setQuestionMode(id, 'EDIT');
    }
}
