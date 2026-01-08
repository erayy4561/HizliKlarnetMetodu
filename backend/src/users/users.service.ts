import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AccountType } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(userData: Partial<User>): Promise<User> {
        const salt = await bcrypt.genSalt();
        const password = userData.password || 'defaultPassword';
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = this.usersRepository.create({
            ...userData,
            password: hashedPassword,
            accountType: userData.accountType || AccountType.STANDARD,
        });
        return this.usersRepository.save(newUser);
    }

    async findOne(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async findById(id: number): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }
}
