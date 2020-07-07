import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MultipleChoiceController } from './multiple-choice.controller';
import { MultipleChoiceService } from './multiple-choice.service';
import { MultipleChoice, MCSchema } from './multiple-choice.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: MultipleChoice.name, schema: MCSchema }])],
  controllers: [MultipleChoiceController],
  providers: [MultipleChoiceService]
})
export class MultipleChoiceModule {}
