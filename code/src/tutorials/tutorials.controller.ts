import { Controller, Get, Render, Request, UseFilters } from '@nestjs/common';
import { TutorialsService } from './tutorials.service';
import { AuthExceptionFilter } from 'src/user/auth-exceptions.filter';

@Controller()
@UseFilters(AuthExceptionFilter)

export class TutorialsController {
    constructor(private readonly tutorialsService: TutorialsService) {}
    @Get('tutorials-mc')
    @Render('tutorials-mc')
    getTutorialsMCView(@Request() req) { 
        return { 
            title: 'Tutorial: Multiple-Choice', 
            description: 'Learn to create questions with multiple answers',
            loggedIn: req.user ? true : false 
          };
    }

    @Get('tutorials-adv')
    @Render('tutorials-adv')
    getTutorialsAdvView(@Request() req) { 
        return { 
            title: 'Tutorial: Advanced', 
            description: 'Learn to create questions with code',
            loggedIn: req.user ? true : false 
          };
    }

    @Get('tutorials-exams')
    @Render('tutorials-exams')
    getTutorialsExamsView(@Request() req) { 
        return { 
            title: 'Tutorial: Exams', 
            description: 'Learn to create exams using your questions',
            loggedIn: req.user ? true : false 
          };
    }
}

