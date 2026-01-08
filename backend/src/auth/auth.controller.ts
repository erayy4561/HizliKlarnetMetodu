import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth') // Matches /api/auth prefix via global prefix setting later
export class AuthController {
    constructor(private authService: AuthService) { }

    /**
     * Kullanıcı girişi yapar.
     * @param req - { username, password } içeren obje
     * @returns JWT token içeren obje
     */
    @Post('login')
    async login(@Body() req) {
        const user = await this.authService.validateUser(req.username, req.password);
        if (!user) {
            return { error: 'Invalid credentials' };
        }
        return this.authService.login(user);
    }

    /**
     * Yeni kullanıcı kaydı oluşturur.
     * @param createUserDto - Yeni kullanıcı bilgilerini içeren obje
     * @returns JWT token içeren obje
     */
    @Post('register')
    async register(@Body() createUserDto) {
        return this.authService.register(createUserDto);
    }

    // Helper for frontend checking token validity
    /**
     * Token'dan kullanıcı profilini döner.
     * Frontend token kontrolü için kullanılır.
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
