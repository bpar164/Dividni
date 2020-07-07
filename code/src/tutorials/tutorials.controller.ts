import { Controller, Get, Render } from '@nestjs/common';
import { TutorialsService } from './tutorials.service';

@Controller()
export class TutorialsController {
    constructor(private readonly tutorialsService: TutorialsService) {}
    @Get('tutorials-mc')
    @Render('tutorials-mc')
    getTutorialsMCView() { 
        return { 
            title: 'Tutorial: Multiple-Choice', 
            description: 'Learn to create questions with multiple answers' 
          };
    }

    @Get('tutorials-adv')
    @Render('tutorials-adv')
    getTutorialsAdvView() { 
        return { 
            title: 'Tutorial: Advanced', 
            description: 'Learn to create questions with code' 
          };
    }

    @Get('tutorials-exams')
    @Render('tutorials-exams')
    getTutorialsExamsView() { 
        return { 
            title: 'Tutorial: Exams', 
            description: 'Learn to create exams using your questions' 
          };
    }
}

