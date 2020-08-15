import { Controller, Get, Render, Request, UseFilters, UseGuards, Post, Param } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { AuthExceptionFilter } from 'src/user/auth-exceptions.filter';
import { AuthenticatedGuard } from 'src/user/authenticated.guard';
import { UserService } from 'src/user/user.service';

@Controller()
@UseFilters(AuthExceptionFilter)

export class ExamsController {
    constructor(private readonly examsService: ExamsService, private readonly userService: UserService) {}
    @UseGuards(AuthenticatedGuard)
    @Get('exams')
    @Render('exams')
    async getExamsView(@Request() req) { 
        let userID = await this.userService.getUserIDByEmail(req.user.email);
        return { 
            title: 'Exams', 
            description: 'Create exams using your multiple-choice and advanced questions',
            loggedIn: (req.user !== undefined) ? true : false, 
            picture: req.user ? req.user.picture : null,
            id: userID 
          };
    }

    @Post('exams/:id')
    async generateQuestion(@Request() req, @Param('id') id): Promise<boolean> { 
        let userID = await this.userService.getUserIDByEmail(req.user.email);
        if (id === 'currentUserID') {
            id = userID;
        } else if (id == userID) {
            //User must not share exam with self
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
    @Get('exams-my')
    @Render('exams-my')
    getExamsMyView(@Request() req) { 
        return { 
            title: 'Exams', 
            description: 'Browse the exams that you have created',
            loggedIn: (req.user !== undefined) ? true : false, 
            picture: req.user ? req.user.picture : null 
          };
    }
}
