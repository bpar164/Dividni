import { Controller, Get, Render, Request } from '@nestjs/common';
import { TutorialsService } from './tutorials.service';

@Controller()

export class TutorialsController {
    constructor(private readonly tutorialsService: TutorialsService) {}
    @Get('tutorials-mc')
    @Render('tutorials-mc')
    getTutorialsMCView(@Request() req) { 
        return { 
            title: 'Tutorial: Multiple-Choice', 
            description: 'Learn to create questions with multiple answers',
            loggedIn: (req.user !== undefined) ? true : false, 
            picture: req.user ? req.user.picture : null 
          };
    }

    @Get('tutorials-adv')
    @Render('tutorials-adv')
    getTutorialsAdvView(@Request() req) { 
        return { 
            title: 'Tutorial: Advanced', 
            description: 'Learn to create questions with code',
            loggedIn: (req.user !== undefined) ? true : false, 
            picture: req.user ? req.user.picture : null 
          };
    }

    @Get('tutorials-exams')
    @Render('tutorials-exams')
    getTutorialsExamsView(@Request() req) { 
        return { 
            title: 'Tutorial: Exams', 
            description: 'Learn to create exams using your questions',
            loggedIn: (req.user !== undefined) ? true : false, 
            picture: req.user ? req.user.picture : null 
          };
    }
}

