import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {

  constructor(private prisma: PrismaService) {}

  create(userId: string, taskId: string, comment: CreateCommentDto) {
    console.log("Прийшло:", comment)
    return this.prisma.comment.create({
      data:{
        text: comment.text,
        id_task: taskId,
        id_user: userId
      }
    })
  }

  findAll(userId: string) {
    return this.prisma.comment.findMany({
      where:{
        id_user: userId
      }
    })
  }

  findOne(taskId: string) {
    return this.prisma.comment.findMany({
      where:{
        id_task: taskId
      }
    })
  }

  remove(taskId: string) {
    return this.prisma.comment.delete({
      where: {id: taskId}
    })
  }
}
