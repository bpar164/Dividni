import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('login')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('logout')
    async logout(@Req() req) {
        req.logout;
    }
  
    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
      let googleUser = this.userService.googleLogin(req);
      console.log('User from google:' + googleUser);
      if (googleUser) {
        //Check if user exists in database
        let user = await this.userService.getUserByEmail(googleUser.email);
        console.log('User from database:' + user);
        if (!(user)) { //If user does not exist, add to database
            let newUser = new UserDTO();
            newUser = googleUser;
            user = await this.userService.addUser(newUser);
            console.log('New user added:' + user);
        }
      } //Else user was not returned by google 
      
    }

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