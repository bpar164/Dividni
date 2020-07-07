import { Controller, Get, Render } from '@nestjs/common';
import { AdvancedService } from './advanced.service';

@Controller()
export class AdvancedController {
    constructor(private readonly advancedService: AdvancedService) {}
    @Get('advanced')
    @Render('advanced')
    getAdvancedView() { 
        return { 
            title: 'Advanced', 
            description: 'Create questions with code' 
          };
    }

    @Get('advanced-my')
    @Render('advanced-my')
    getAdvancedMyView() { 
        return { 
            title: 'Advanced', 
            description: 'Browse the advanced questions that you have created' 
          };
    }
}
