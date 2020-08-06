import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('users/:email')
    async getUserIdByEmail(@Param('email') email) {
        let user = new UserDTO;
        try {
            //Fetch user
            user = await this.userService.getUserByEmail(email);
            if (!(user)) { //User not found
                return null;
            } else {
                return user; //User found
            }
        } catch (err) {
            return null; //User not found
        }    
    }

}