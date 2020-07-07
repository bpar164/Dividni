import { Test, TestingModule } from '@nestjs/testing';
import { AdvancedService } from './advanced.service';

describe('AdvancedService', () => {
  let service: AdvancedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvancedService],
    }).compile();

    service = module.get<AdvancedService>(AdvancedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
