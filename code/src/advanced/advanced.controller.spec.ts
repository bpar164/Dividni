import { Test, TestingModule } from '@nestjs/testing';
import { AdvancedController } from './advanced.controller';

describe('Advanced Controller', () => {
  let controller: AdvancedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvancedController],
    }).compile();

    controller = module.get<AdvancedController>(AdvancedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
