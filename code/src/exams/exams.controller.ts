import { Controller, Get, Render, Request, UseFilters } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { AuthExceptionFilter } from 'src/user/auth-exceptions.filter';

@Controller()
@UseFilters(AuthExceptionFilter)

export class ExamsController {
    constructor(private readonly examsService: ExamsService) {}
    @Get('exams')
    @Render('exams')
    getAdvancedView(@Request() req) { 
        return { 
            title: 'Exams', 
            description: 'Create exams using your multiple-choice and advanced questions',
            loggedIn: req.user ? true : false 
          };
    }

    @Get('exams-my')
    @Render('exams-my')
    getAdvancedMyView(@Request() req) { 
        return { 
            title: 'Exams', 
            description: 'Browse the exams that you have created',
            loggedIn: req.user ? true : false 
          };
    }
}
