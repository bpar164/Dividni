import { Test, TestingModule } from '@nestjs/testing';
import { MultipleChoiceController } from './multiple-choice.controller';

describe('MultipleChoice Controller', () => {
  let controller: MultipleChoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MultipleChoiceController],
    }).compile();

    controller = module.get<MultipleChoiceController>(MultipleChoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
