import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('me')
  findMe() {
    const userId = 2 //임시 값: 로그인 기능 개발 뒤 수정 예정
    return this.usersService.getMyProfile(userId);
  }

  @Patch('me')
  updateMe(@Body() updateUserDto: UpdateUserDto) {
    const userId = 2
    return this.usersService.updateMyProfile(userId, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
