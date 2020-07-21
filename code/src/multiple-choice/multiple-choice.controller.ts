import { Controller, Get, Render, Post, Req, Redirect, Delete, Param } from '@nestjs/common';
import { MultipleChoiceService } from './multiple-choice.service';
import { QuestionFormDTO } from './question-form.dto';
import { Request } from 'express';

@Controller()
export class MultipleChoiceController {
    constructor(private readonly multipleChoiceService: MultipleChoiceService) {}
    @Get('multiple-choice')
    @Render('multiple-choice')
    getMultipleChoiceView() { 
        return { 
            title: 'Multiple-Choice', 
            description: 'Create questions with multiple answers' 
          };
    }

    @Post('multiple-choice-preview')
    async generateQuestion(formContents): Promise<boolean> { 
        let question = new QuestionFormDTO();
        try {
            question = formContents;
            question.correctAnswers = this.multipleChoiceService.removeEmptyElements(question.correctAnswers);
            question.incorrectAnswers = this.multipleChoiceService.removeEmptyElements(question.incorrectAnswers);
            if (this.multipleChoiceService.validateQuestion(question)) {
                let xml = this.multipleChoiceService.convertToXML(question);
                await this.multipleChoiceService.generateQuestion(question, xml);
                return true; //Question created
            } else {
                return false; //Question not created
            }
        } catch (err) {
            return false;
        }    
    }

    @Get('multiple-choice-my')
    @Render('multiple-choice-my')
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
}
