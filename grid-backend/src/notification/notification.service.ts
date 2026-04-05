import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService){}

  async create(senderId: string, dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        ...dto,
        id_sender: senderId
      }
    })
  }

  findAll(userId: string) {
    return this.prisma.notification.findMany({
      where:{
        id_receiver: userId
      }
    })
  }

  findOne(notificationId: string) {
    return this.prisma.notification.findUnique({
      where: {
        id: notificationId
      }
    })
  }

  update(notificationId: string, updateNotificationDto: UpdateNotificationDto) {
    return this.prisma.notification.update({
      where: {
        id: notificationId
      },
      data: {
        isRead: updateNotificationDto.isRead
      }
    })
  }

  remove(notificationId: string) {
    return this.prisma.notification.delete({
      where: {
        id: notificationId
      }
    })
  }
}
