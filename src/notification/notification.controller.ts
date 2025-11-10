import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('notify')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createNotification(@Body() body: any, @Req() req: any) {
    const user = req.user;
    const payload = {
      ...body,
      sender: user.id,
    };
    return this.notificationService.sendNotification(payload);
  };
};
