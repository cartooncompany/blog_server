import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.js';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({ where: { email } });
        if(!user) {
            throw new ConflictException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            throw new ConflictException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        const payload = { sub: user.id, email: user.email }
        const accessToken = await this.jwtService.signAsync(payload);

        return { accessToken };
    }
}
