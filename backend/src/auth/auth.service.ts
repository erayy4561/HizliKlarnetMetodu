import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        console.log('[AUTH] Attempting to validate user:', username);
        const user = await this.usersService.findOne(username);
        console.log('[AUTH] User found:', user ? `yes (id: ${user.id})` : 'no');

        if (user && user.password) {
            console.log('[AUTH] Password exists, comparing...');
            const isMatch = await bcrypt.compare(pass, user.password);
            console.log('[AUTH] Password match:', isMatch);

            if (isMatch) {
                const { password, ...result } = user;
                return result;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id, roles: [user.accountType] };
        return {
            token: this.jwtService.sign(payload),
        };
    }

    async register(user: any) {
        const newUser = await this.usersService.create(user);
        const payload = { username: newUser.username, sub: newUser.id, roles: [newUser.accountType] };
        return {
            token: this.jwtService.sign(payload)
        };
    }
}
