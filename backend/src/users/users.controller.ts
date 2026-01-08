import { Controller, Get, Request, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me') // Often used, or profile
    getProfile(@Request() req) {
        return this.usersService.findById(req.user.userId);
    }
}
