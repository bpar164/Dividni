import { Controller, Get, Render } from '@nestjs/common';
import { ExamsService } from './exams.service';

@Controller()
export class ExamsController {
    constructor(private readonly examsService: ExamsService) {}
    @Get('exams')
    @Render('exams')
    getAdvancedView() { 
        return { 
            title: 'Exams', 
            description: 'Create exams using your multiple-choice and advanced questions' 
          };
    }

    @Get('exams-my')
    @Render('exams-my')
    getAdvancedMyView() { 
        return { 
            title: 'Exams', 
            description: 'Browse the exams that you have created' 
          };
    }
}
