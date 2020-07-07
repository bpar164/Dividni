import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdvancedModule } from './advanced/advanced.module';
import { ExamsModule } from './exams/exams.module';
import { MultipleChoiceModule } from './multiple-choice/multiple-choice.module';
import { TutorialsModule } from './tutorials/tutorials.module';

@Module({
  imports: [AdvancedModule, ExamsModule, MultipleChoiceModule, TutorialsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
