import { Controller, Get, Render, Request, UseFilters, UseGuards, Post, Param } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { AuthExceptionFilter } from 'src/user/auth-exceptions.filter';
import { AuthenticatedGuard } from 'src/user/authenticated.guard';
import { UserService } from 'src/user/user.service';
import { MultipleChoiceService } from 'src/multiple-choice/multiple-choice.service';
import { ExamFormDTO } from './exam-form.dto';

@Controller()
@UseFilters(AuthExceptionFilter)

export class ExamsController {
    constructor(private readonly examsService: ExamsService, private readonly userService: UserService, private readonly multipleChoiceService: MultipleChoiceService) {}
    @UseGuards(AuthenticatedGuard)
    @Get('exams')
    @Render('exams')
    async getExamsView(@Request() req) { 
        let userID = await this.userService.getUserIDByEmail(req.user.email);
        return { 
            title: 'Exams', 
            description: 'Create exams using your multiple-choice and advanced questions',
            mcQuestions: await this.multipleChoiceService.fetchUserQuestions(userID),
            advQuestions: [],
            loggedIn: (req.user !== undefined) ? true : false, 
            picture: req.user ? req.user.picture : null
          };
    }

    @Post('exams/:id')
    async generateExam(@Request() req, @Param('id') id): Promise<boolean> { 
        let userID = await this.userService.getUserIDByEmail(req.user.email);
        if (id === 'currentUserID') {
            id = userID;
        } else if (id == userID) {
            //User must not share exam with self
            return false;   
        }
        let exam = new ExamFormDTO();
        try {
            exam = req.body;
            if (this.examsService.validateExam(exam)) {
                await this.examsService.generateQuestion(exam, id); 
                return true; //Question created
            } else {
                return false; //Question not created
            }
        } catch (err) {
            return false; //Exam not created
        }   
    }

    @UseGuards(AuthenticatedGuard)
    @Get('exams-my')
    @Render('exams-my')
    async getExamsMyView(@Request() req) { 
        let userID = await this.userService.getUserIDByEmail(req.user.email);
        return { 
            title: 'Exams', 
            description: 'Browse the exams that you have created',
            exams: await this.examsService.fetchUserExams(userID),
            loggedIn: (req.user !== undefined) ? true : false, 
            picture: req.user ? req.user.picture : null 
          };
    }
}
