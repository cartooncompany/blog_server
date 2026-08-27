import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  //회원가입 로직
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

  //프로필 정보 조회
  async getMyProfile(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if(!user) {
      throw new ConflictException('유저를 찾을 수 없습니다.');
    }

    const {password, ...result} = user;
    return result;
  }

  //프로필 정보 수정
  async updateMyProfile(id: number, updateUserDto: UpdateUserDto) {
    await this.getMyProfile(id);

    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    const {password, ...result} = user;
    return result;
  }
}
