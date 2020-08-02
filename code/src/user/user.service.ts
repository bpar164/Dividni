import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

    async getUserByEmail(email: string) {  
        return this.UserModel.findOne({ email: email }).exec();
    }

}