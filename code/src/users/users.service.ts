import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { UserDTO } from './user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private UsersModel: Model<User>) {}

    async getUserByEmail(email: string) {  
        console.log(email);
        return this.UsersModel.findOne({ email: email }).exec();
    }

}