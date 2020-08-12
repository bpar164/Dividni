import { Controller, Get, Render, Request, UseFilters, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { AuthExceptionFilter } from 'src/user/auth-exceptions.filter';
import { AuthenticatedGuard } from 'src/user/authenticated.guard';

@Controller()
@UseFilters(AuthExceptionFilter)

export class ExamsController {
    constructor(private readonly examsService: ExamsService) {}
    @UseGuards(AuthenticatedGuard)
    @Get('exams')
    @Render('exams')
    getAdvancedView(@Request() req) { 
        return { 
            title: 'Exams', 
            description: 'Create exams using your multiple-choice and advanced questions',
            loggedIn: (req.user !== undefined) ? true : false, 
            picture: req.user ? req.user.picture : null 
          };
    }

    @UseGuards(AuthenticatedGuard)
    @Get('exams-my')
    @Render('exams-my')
    getAdvancedMyView(@Request() req) { 
        return { 
            title: 'Exams', 
            description: 'Browse the exams that you have created',
            loggedIn: (req.user !== undefined) ? true : false, 
            picture: req.user ? req.user.picture : null 
          };
    }
}
