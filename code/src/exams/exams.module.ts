import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { ExamsSchema, Exams } from 'src/exams/exams.schema';
import { UserService } from 'src/user/user.service';
import { UserSchema, User } from 'src/user/user.schema';
import { MultipleChoice, MCSchema } from 'src/multiple-choice/multiple-choice.schema';
import { MultipleChoiceService } from 'src/multiple-choice/multiple-choice.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exams.name, schema: ExamsSchema }]),
    MongooseModule.forFeature([{ name: MultipleChoice.name, schema: MCSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [ExamsController],
  providers: [ExamsService, UserService, MultipleChoiceService]
})
export class ExamsModule { }
