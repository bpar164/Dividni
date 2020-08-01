import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('users/:email')
    async getUserByEmail(@Param('email') email) {
        return await this.usersService.getUserByEmail(email);
    }

}