import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ProjectAccessGuard } from 'src/common/guards/project.guards';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guards';

@UseGuards(AuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@CurrentUser('sub') senderId: string, @Body() dto: CreateNotificationDto) {
    return this.notificationService.create(senderId, dto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.notificationService.findAll(userId);
  }

  @Get(':notificationId')
  findOne(@Param('notificationId') notificationId: string) {
    return this.notificationService.findOne(notificationId);
  }

  @Patch(':notificationId')
  update(@Param('notificationId') notificationId: string) {
    return this.notificationService.update(notificationId);
  }

  @Delete(':notificationId')
  remove(@Param('notificationId') notificationId: string) {
    return this.notificationService.remove(notificationId);
  }
}
