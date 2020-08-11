import { Controller, Get, Render, Request, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthExceptionFilter } from './user/auth-exceptions.filter';

@Controller()
@UseFilters(AuthExceptionFilter)

export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index.ejs')
  getIndexView(@Request() req) {
    console.log(req.user)
    return { 
      title: 'Individualized Assessments', 
      description: 'Enhancing learning via assessments unique to every student',
      loggedIn: (typeof req.user !== undefined) ? true : false, 
      picture: req.user ? req.user.picture : null,
      message: req.flash('Login')  
    };
  }
}
