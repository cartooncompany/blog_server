import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PostsController } from './posts.controller.js';
import { PostsService } from './posts.service.js';


@Module({
  imports: [PassportModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
