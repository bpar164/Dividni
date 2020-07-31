import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MultipleChoiceController } from './multiple-choice.controller';
import { MultipleChoiceService } from './multiple-choice.service';
import { MultipleChoice, MCSchema } from './multiple-choice.schema';
import { User, UserSchema } from '../user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: MultipleChoice.name, schema: MCSchema }, { name: User.name, schema: UserSchema }])],
  controllers: [MultipleChoiceController],
  providers: [MultipleChoiceService]
})
export class MultipleChoiceModule {}
