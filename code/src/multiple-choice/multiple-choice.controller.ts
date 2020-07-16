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
    @Redirect('/multiple-choice-my', 301)
    async generateQuestion(@Req() request: Request) { 
        let question = new QuestionFormDTO();
        question = request.body;
        question.correctAnswers = this.multipleChoiceService.removeEmptyElements(question.correctAnswers);
        question.incorrectAnswers = this.multipleChoiceService.removeEmptyElements(question.incorrectAnswers);  
        //TODO perform validation
        let xml = this.multipleChoiceService.convertToXML(question);
        await this.multipleChoiceService.generateQuestion(question, xml);
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
