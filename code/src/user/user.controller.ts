import { Controller, Get, Param, Req, Request, Res, UseGuards, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { LoginGuard } from './login.guard';
import { AuthExceptionFilter } from './auth-exceptions.filter';

@Controller()
@UseFilters(AuthExceptionFilter)

export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('login')
    @UseGuards(LoginGuard)
    async googleAuth(@Req() req) {}

    @Get('logout')
    async logout(@Request() req, @Res() res: Response) {
        req.session.destroy(() => {
            req.logout();
            res.redirect('/');
        });
    }
  
    @Get('google/redirect')
    @UseGuards(LoginGuard)
    async googleAuthRedirect(@Request() req, @Res() res: Response) {
      let googleUser = this.userService.googleLogin(req);
      if (googleUser) {
        //Check if user exists in database
        let user = await this.userService.getUserByEmail(googleUser.email);
        if (!(user)) { //If user does not exist, add to database
            let newUser = new UserDTO();
            newUser = googleUser;
            user = await this.userService.addUser(newUser);
        }
      } //Else user was not returned by google 
      res.redirect('/');
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