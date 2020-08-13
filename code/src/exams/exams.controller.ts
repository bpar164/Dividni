import { Controller, Get, Render, Request, UseFilters, UseGuards } from '@nestjs/common';
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
