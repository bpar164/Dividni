import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { UserService } from 'src/user/user.service';
import { UserSchema, User } from 'src/user/user.schema';
import { MultipleChoiceService } from 'src/multiple-choice/multiple-choice.service';
import { MCSchema, MultipleChoice } from 'src/multiple-choice/multiple-choice.schema';

@Module({
  imports: [

    MongooseModule.forFeature([{ name: MultipleChoice.name, schema: MCSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [ExamsController],
  providers: [ExamsService, UserService, MultipleChoiceService]
})
export class ExamsModule {}
