import { Controller, Get, Render, Request, UseFilters } from '@nestjs/common';
import { AdvancedService } from './advanced.service';
import { AuthExceptionFilter } from 'src/user/auth-exceptions.filter';

@Controller()
@UseFilters(AuthExceptionFilter)

export class AdvancedController {
    constructor(private readonly advancedService: AdvancedService) {}
    @Get('advanced')
    @Render('advanced')
    getAdvancedView(@Request() req) { 
        return { 
            title: 'Advanced', 
            description: 'Create questions with code',
            loggedIn: req.user ? true : false 
          };
    }

    @Get('advanced-my')
    @Render('advanced-my')
    getAdvancedMyView(@Request() req) { 
        return { 
            title: 'Advanced', 
            description: 'Browse the advanced questions that you have created',
            loggedIn: req.user ? true : false 
          };
    }
}
