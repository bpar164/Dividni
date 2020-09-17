import { Controller, Get, Render, Post, Request, Delete, Param, Put, UseGuards, UseFilters } from '@nestjs/common';
import { MultipleChoiceService } from './multiple-choice.service';
import { QuestionFormDTO } from './question-form.dto';
import { AuthenticatedGuard } from 'src/user/authenticated.guard';
import { UserService } from 'src/user/user.service';
import { AuthExceptionFilter } from 'src/user/auth-exceptions.filter';


@Controller()
@UseFilters(AuthExceptionFilter)

export class MultipleChoiceController {
    constructor(private readonly multipleChoiceService: MultipleChoiceService, private readonly userService: UserService) {}

    @UseGuards(AuthenticatedGuard)
    @Get('multiple-choice')
    @Render('multiple-choice')
    getMultipleChoiceView(@Request() req) { 
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
            action: questionAction,
            loggedIn: (req.user !== undefined) ? true : false,
            picture: req.user ? req.user.picture : null
          };
    }

    @UseGuards(AuthenticatedGuard)
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

    @UseGuards(AuthenticatedGuard)
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
            questions: await this.multipleChoiceService.fetchUserQuestions(userID),
            loggedIn: (req.user !== undefined) ? true : false,
            picture: req.user ? req.user.picture : null
          };
    }

    @UseGuards(AuthenticatedGuard)
    @Get('multiple-choice-my/:id')
    async getQuestion(@Param('id') id) {
        return await this.multipleChoiceService.getQuestion(id);
    }

    @UseGuards(AuthenticatedGuard)
    @Delete('multiple-choice-my/:id')
    async deleteQuestion(@Param('id') id) {
        await this.multipleChoiceService.deleteQuestion(id);
    }

    @UseGuards(AuthenticatedGuard)
    @Get('template-question/:id')
    templateQuestion(@Param('id') id) {
        this.multipleChoiceService.setQuestionMode(id, 'TEMPLATE');
    }

    @UseGuards(AuthenticatedGuard)
    @Get('edit-question/:id')
    editQuestion(@Param('id') id) {
        this.multipleChoiceService.setQuestionMode(id, 'EDIT');
    }
}
