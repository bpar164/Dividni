import { Controller, Get, Render, Post, Req, Request, Delete, Param, Put, UseGuards } from '@nestjs/common';
import { MultipleChoiceService } from './multiple-choice.service';
import { QuestionFormDTO } from './question-form.dto';
import { AuthenticatedGuard } from 'src/user/authenticated.guard';
import { UserService } from 'src/user/user.service';
import { UserDTO } from 'src/user/user.dto';

@Controller()
export class MultipleChoiceController {
    constructor(private readonly multipleChoiceService: MultipleChoiceService, private readonly userService: UserService) {}

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

    @Post('multiple-choice/:id')
    async generateQuestion(@Request() req, @Param('id') id): Promise<boolean> { 
        let userID = await this.userService.getUserIDByEmail(req.user.email);
        if (id === 'currentUserID') {
            id = userID;
        } else if (id == userID) {
            //User must not share question with self
            return false;   
        }
        let question = new QuestionFormDTO();
        try {
            question = req.body;
            question.correctAnswers = this.multipleChoiceService.removeEmptyElements(question.correctAnswers);
            question.incorrectAnswers = this.multipleChoiceService.removeEmptyElements(question.incorrectAnswers);
            if (this.multipleChoiceService.validateQuestion(question)) {
                await this.multipleChoiceService.generateQuestion(question, id);
                return true; //Question created
            } else {
                return false; //Question not created
            }
        } catch (err) {
            return false; //Question not created
        }    
    }

    @Put('multiple-choice/:id')
    async updateQuestion(@Request() req, @Param('id') id): Promise<boolean> { 
        let question = new QuestionFormDTO();
        try {
            question = req.body;
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

    @UseGuards(AuthenticatedGuard)
    @Get('multiple-choice-my')
    @Render('multiple-choice-my') 
    async getMultipleChoiceMyView(@Request() req) { 
        let userID = await this.userService.getUserIDByEmail(req.user.email);
        return { 
            title: 'Multiple-Choice', 
            description: 'Browse the multiple-choice questions that you have created',
            questions: await this.multipleChoiceService.fetchUserQuestions(userID)
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
