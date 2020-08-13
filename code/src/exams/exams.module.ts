import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { UserService } from 'src/user/user.service';
import { UserSchema, User } from 'src/user/user.schema';

@Module({
  imports: [
     
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [ExamsController],
  providers: [ExamsService, UserService]
})
export class ExamsModule {}
