import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MultipleChoiceModule } from './multiple-choice/multiple-choice.module';
import { TutorialsModule } from './tutorials/tutorials.module';
import { ExamsModule } from './exams/exams.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    MultipleChoiceModule, TutorialsModule, ExamsModule, UserModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot('mongodb+srv://admin:6q3RZH1a8oJo5xjV@dividni-bzvpa.mongodb.net/dividni?retryWrites=true&w=majority')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

