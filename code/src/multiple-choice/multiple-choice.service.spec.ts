import { Test, TestingModule } from '@nestjs/testing';
import { MultipleChoiceService } from './multiple-choice.service';

describe('MultipleChoiceService', () => {
  let service: MultipleChoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MultipleChoiceService],
    }).compile();

    service = module.get<MultipleChoiceService>(MultipleChoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
