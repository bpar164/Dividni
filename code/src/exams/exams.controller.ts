import { Controller, Get, Render, Request, UseFilters, UseGuards, Post, Param, Res, Delete, Put } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { AuthExceptionFilter } from 'src/user/auth-exceptions.filter';
import { AuthenticatedGuard } from 'src/user/authenticated.guard';
import { UserService } from 'src/user/user.service';
import { MultipleChoiceService } from 'src/multiple-choice/multiple-choice.service';
import { ExamFormDTO } from './exam-form.dto';

@Controller()
@UseFilters(AuthExceptionFilter)

export class ExamsController {
    constructor(private readonly examsService: ExamsService, private readonly userService: UserService, private readonly multipleChoiceService: MultipleChoiceService) { }

    @UseGuards(AuthenticatedGuard)
    @Get('exams')
    @Render('exams')
    async getExamsView(@Request() req) {
        let examID = null;
        let examAction = null;
        let examMode = this.examsService.getExamMode();
        if (examMode) {
            examID = examMode.id;
            examAction = examMode.action;
            this.examsService.setExamMode(null, null);
        }
        let userID = await this.userService.getUserIDByEmail(req.user.email);
        return {
            title: 'Exams',
            description: 'Create exams using your multiple-choice questions',
            mcQuestions: await this.multipleChoiceService.fetchUserQuestions(userID),
            id: examID,
            action: examAction,
            loggedIn: (req.user !== undefined) ? true : false,
            picture: req.user ? req.user.picture : null
        };
    }

    @UseGuards(AuthenticatedGuard)
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
                await this.examsService.generateExam(exam, id);
                return true;
            } else {
                return false; //Exam not created
            }
        } catch (err) {
            return false; //Exam not created
        }
    }

    @UseGuards(AuthenticatedGuard)
    @Put('multiple-choice/:id')
    async updateExam(@Request() req, @Param('id') id): Promise<boolean> {
        let exam = new ExamFormDTO();
        try {
            exam = req.body;
            if (this.examsService.validateExam(exam)) {
                await this.examsService.generateExam(exam, id);
                return true;
            } else {
                return false; //Exam not created
            }
        } catch (err) {
            return false; //Exam not created
        }
    }

    @UseGuards(AuthenticatedGuard)
    @Get('exams/merge/:name')
    async mergePDFs(@Param('name') examName): Promise<boolean> {
        try {
            return await this.examsService.mergePDFs(examName);
        } catch (err) {
            return false;
        }
    }

    @UseGuards(AuthenticatedGuard)
    @Get('exams/download/:name')
    async downloadExam(@Param('name') examName, @Res() res): Promise<boolean> {
        let path = process.cwd();
        path = path.substring(0, path.length - 5) + `\\` + examName + `.zip`; //Remove \code from path
        try {
            await this.examsService.zipFolder(examName);
            res.download(path, examName + `.zip`);
            return this.examsService.deleteFolder(examName);
        } catch (err) {
            return false;
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

    @UseGuards(AuthenticatedGuard)
    @Get('exams-my/:id')
    async getExam(@Param('id') id) {
        return await this.examsService.getExam(id);
    }

    @UseGuards(AuthenticatedGuard)
    @Delete('exams-my/:id')
    async deleteExam(@Param('id') id) {
        await this.examsService.deleteExam(id);
    }

    @UseGuards(AuthenticatedGuard)
    @Get('template-exam/:id')
    templateExam(@Param('id') id) {
        this.examsService.setExamMode(id, 'TEMPLATE');
    }

    @UseGuards(AuthenticatedGuard)
    @Get('edit-exam/:id')
    editExam(@Param('id') id) {
        this.examsService.setExamMode(id, 'EDIT');
    }
}
