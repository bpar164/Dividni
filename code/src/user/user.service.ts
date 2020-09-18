import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private UserModel: Model<User>) { }

    googleLogin(req) {
        if (!req.user) {
            return null;
        } else {
            return req.user;
        }
    }

    async getUserByEmail(email: string) {
        return this.UserModel.findOne({ email: email }).exec();
    }

    async getUserIDByEmail(email: string) {
        let user = this.UserModel.findOne({ email: email }).exec();
        return (await user)._id;
    }

    async addUser(user: UserDTO) {
        let newUser = new this.UserModel(user);
        return newUser.save();
    }

}