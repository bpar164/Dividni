import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MultipleChoiceController } from './multiple-choice.controller';
import { MultipleChoiceService } from './multiple-choice.service';
import { MultipleChoice, MCSchema } from './multiple-choice.schema';
import { UserService } from 'src/user/user.service';
import { UserSchema, User } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MultipleChoice.name, schema: MCSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [MultipleChoiceController],
  providers: [MultipleChoiceService, UserService]
})
export class MultipleChoiceModule { }
