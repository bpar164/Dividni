import { Module } from '@nestjs/common';
import { MultipleChoiceController } from './multiple-choice.controller';
import { MultipleChoiceService } from './multiple-choice.service';

@Module({
  controllers: [MultipleChoiceController],
  providers: [MultipleChoiceService]
})
export class MultipleChoiceModule {}
