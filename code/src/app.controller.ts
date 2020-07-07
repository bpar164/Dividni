import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index.ejs')
  getIndexView() {
    return { 
      title: 'Individualized Assessments', 
      description: 'Enhancing learning via assessments unique to every student' 
    };
  }
}
