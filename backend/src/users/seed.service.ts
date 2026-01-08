import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, AccountType } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async onModuleInit() {
        await this.createDefaultSuperAdmin();
    }

    private async createDefaultSuperAdmin() {
        const defaultUsername = 'erayhzl';
        const defaultEmail = 'erayy4561@gmail.com';
        const defaultPassword = '123456';

        // Kullanıcının zaten var olup olmadığını kontrol et (username'e göre)
        const existingUser = await this.usersRepository.findOne({
            where: { username: defaultUsername }
        });

        if (existingUser) {
            // Kullanıcı varsa e-posta ve rolünü güncelle
            if (existingUser.email !== defaultEmail || existingUser.accountType !== AccountType.SUPERADMIN) {
                existingUser.email = defaultEmail;
                existingUser.accountType = AccountType.SUPERADMIN;
                await this.usersRepository.save(existingUser);
                console.log(`[SEED] Default superadmin user "${defaultUsername}" updated with new email and role.`);
            } else {
                console.log(`[SEED] Default superadmin user "${defaultUsername}" already exists.`);
            }
            return;
        }

        // Şifreyi hash'le
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        // Yeni kullanıcı oluştur
        const superAdmin = this.usersRepository.create({
            username: defaultUsername,
            email: defaultEmail,
            password: hashedPassword,
            accountType: AccountType.SUPERADMIN,
        });

        await this.usersRepository.save(superAdmin);
        console.log(`[SEED] Default superadmin user "${defaultUsername}" created successfully.`);
        console.log(`[SEED] Username: ${defaultUsername}, Email: ${defaultEmail}, Password: ${defaultPassword}`);
    }
}

