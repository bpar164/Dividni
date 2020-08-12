import { Controller, Get, Render, Request, UseFilters, UseGuards } from '@nestjs/common';
import { AdvancedService } from './advanced.service';
import { AuthExceptionFilter } from 'src/user/auth-exceptions.filter';
import { AuthenticatedGuard } from 'src/user/authenticated.guard';

@Controller()
@UseFilters(AuthExceptionFilter)

export class AdvancedController {
    constructor(private readonly advancedService: AdvancedService) {}
    @UseGuards(AuthenticatedGuard)
    @Get('advanced')
    @Render('advanced')
    getAdvancedView(@Request() req) { 
        return { 
            title: 'Advanced', 
            description: 'Create questions with code',
            loggedIn: (req.user !== undefined) ? true : false, 
            picture: req.user ? req.user.picture : null 
          };
    }

    @UseGuards(AuthenticatedGuard)
    @Get('advanced-my')
    @Render('advanced-my')
    getAdvancedMyView(@Request() req) { 
        return { 
            title: 'Advanced', 
            description: 'Browse the advanced questions that you have created',
            loggedIn: (req.user !== undefined) ? true : false, 
            picture: req.user ? req.user.picture : null 
          };
    }
}
