import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ReorderPostDto } from './dto/reorder-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post } from '@prisma/client';
import _ from 'lodash';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}

  create(createPostDto: CreatePostDto) {
    return this.prismaService.post.create({
      data: createPostDto,
    });
  }

  findAll() {
    return this.prismaService.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const post = await this.prismaService.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new HttpException(`Post with id ${id} not found`, 404);
    }

    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.prismaService.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  remove(id: number) {
    return this.prismaService.post.delete({
      where: { id },
    });
  }

  // 此方法根據提供的來源和目標索引重新排序貼文。
  // 它會取得所有貼文，移除來源索引位置的貼文，然後將其重新插入
  // 到目標索引位置。最後，它會相應地更新所有貼文的順序。

  async reorder(reorderPostDto: ReorderPostDto) {
    const posts = await this.prismaService.post.findMany();

    const [sourcePost] = posts.splice(reorderPostDto.sourceIndex, 1);
    posts.splice(reorderPostDto.targetIndex, 0, sourcePost);

    const updatePromises = _.map(posts, (post: Post, index: number) => {
      return this.prismaService.post.update({
        where: { id: post.id },
        data: { order: index + 1 },
      });
    });
    return await Promise.all(updatePromises);
  }
}
