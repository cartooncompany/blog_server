import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    //이메일 중복
    const existing = await this.prisma.user.findUnique({where : { email }})
    if (existing) {
      throw new ConflictException("이미 사용중인 이메일입니다.");
    }

    //비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    //DB 저장
    const user = await this.prisma.user.create({
      data: {email, password: hashedPassword, name},
    });

    const {password: _, ...result} = user;
    return result;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
