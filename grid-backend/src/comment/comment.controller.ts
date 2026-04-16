import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';

@UseGuards(AuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@CurrentUser('sub') userId: string, @Query('taskId') taskId: string, @Body() comment: CreateCommentDto) {
    return this.commentService.create(userId, taskId, comment);
  }

  @Get()
  findAll(@CurrentUser('sub') userId: string) {
    return this.commentService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') taskId: string) {
    return this.commentService.findOne(taskId);
  }

  @Delete(':id')
  remove(@Param('id') taskId: string) {
    return this.commentService.remove(taskId);
  }
}
