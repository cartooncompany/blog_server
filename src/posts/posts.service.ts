import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  //게시글 생성
  async create(authorId: number, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        authorId,
      }
    });
  }

  //게시글 전체 조회
  async findAll() {
    return this.prisma.post.findMany({
      include: {
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  //게시글 상세 조회
  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true } },
      },
    });
    return post;
  }

  async update(id: number, userId: number, dto: UpdatePostDto) {
    const post = await this.findOne(id);
    if(post?.authorId !== userId) {
      throw new ForbiddenException('수정 권환이 없습니다');
    }
    return this.prisma.post.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    const post = await this.findOne(id);
    if(post?.authorId !== userId) {
      throw new ForbiddenException('삭제 권환이 없습니다.');
    }
    await this.prisma.post.delete({ where: { id } });
    return { message: '삭제되었습니다' };
  }
}
