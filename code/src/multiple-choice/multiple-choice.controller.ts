import { Controller, Get, Render, Post, Req, Delete, Param } from '@nestjs/common';
import { MultipleChoiceService } from './multiple-choice.service';
import { QuestionFormDTO } from './question-form.dto';
import { Request } from 'express';
import { MultipleChoiceDTO } from './multiple-choice.dto';

@Controller()
export class MultipleChoiceController {
    constructor(private readonly multipleChoiceService: MultipleChoiceService) {}

    @Get('multiple-choice')
    @Render('multiple-choice')
    getMultipleChoiceView() { 
        return { 
            title: 'Multiple-Choice', 
            description: 'Create questions with multiple answers',
          };
    }

    @Post('multiple-choice-preview')
    async generateQuestion(@Req() request: Request): Promise<boolean> { 
        let question = new QuestionFormDTO();
        try {
            question = request.body;
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
    async templateQuestion(@Param('id') id) {
        let multipleChoice = new MultipleChoiceDTO();
        multipleChoice = await this.getQuestion(id);
        console.log(multipleChoice.question);
    }
}
