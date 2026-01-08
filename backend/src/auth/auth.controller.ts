import { Controller, Post, Body, UseGuards, Get, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) { }

    /**
     * Kullanıcı girişi yapar.
     * @param req - { username, password } içeren obje
     * @returns JWT token içeren obje
     */
    @Post('login')
    async login(@Body() req) {
        console.log('[AUTH CONTROLLER] Login request received:', { username: req.username });
        if (!req.username || !req.password) {
            console.log('[AUTH CONTROLLER] Missing username or password');
            throw new UnauthorizedException('Username and password are required');
        }
        const user = await this.authService.validateUser(req.username, req.password);
        if (!user) {
            console.log('[AUTH CONTROLLER] User validation failed');
            throw new UnauthorizedException('Invalid credentials');
        }
        console.log('[AUTH CONTROLLER] Login successful, generating token');
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

    /**
     * Token'dan kullanıcı profilini döner.
     * Frontend token kontrolü için kullanılır.
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        console.log('[AUTH CONTROLLER] Profile request received');
        console.log('[AUTH CONTROLLER] User from token:', req.user);
        console.log('[AUTH CONTROLLER] Authorization header:', req.headers?.authorization);
        const user = await this.usersService.findById(req.user.userId);
        console.log('[AUTH CONTROLLER] User found:', user ? `yes (id: ${user.id})` : 'no');
        return user;
    }
}
