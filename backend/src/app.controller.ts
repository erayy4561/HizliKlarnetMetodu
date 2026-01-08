import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService
  ) { }

  /**
   * Basit health-check endpointi.
   * @returns "Hello World!" mesajı
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Giriş yapmış kullanıcının kendi profil bilgilerini getirir.
   * @param req - Token'dan çözülen user bilgisi
   * @returns User objesi (şifre hariç)
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }
}
