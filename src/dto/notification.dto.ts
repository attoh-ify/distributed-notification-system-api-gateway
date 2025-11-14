import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty({ enum: ['email', 'push'], description: 'Notification type' })
  type: 'email' | 'push';

  @ApiProperty({ description: 'Sender of the notification' })
  sender: string;

  @ApiProperty({ description: 'Recipient email or device token' })
  recipient: string;

  @ApiProperty({ description: 'Title of the notification' })
  title: string;

  @ApiPropertyOptional({ description: 'Body of the notification (push notifications)' })
  body?: string;

  @ApiPropertyOptional({ description: 'Template ID for email notifications' })
  template_id?: string;

  @ApiPropertyOptional({ description: 'Variables to render in the template', type: Object })
  template_vars?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Additional data for push notifications', type: Object })
  data?: Record<string, any>;
}

export class MessageDto {
  @ApiProperty({ description: 'Unique notification ID' })
  notification_id: string;

  @ApiProperty({ enum: ['email', 'push'], description: 'Notification type' })
  type: 'email' | 'push';

  @ApiProperty({ description: 'Sender of the notification' })
  sender: string;

  @ApiProperty({ description: 'Recipient email or device token' })
  recipient: string;

  @ApiProperty({ description: 'Notification title' })
  title: string;

  @ApiPropertyOptional({ description: 'Notification body' })
  body?: string;

  @ApiPropertyOptional({ description: 'Push notification data', type: Object })
  data?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: string;
}
