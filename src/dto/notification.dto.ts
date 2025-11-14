export class NotificationDto {
  type: 'email' | 'push';
  sender: string;
  recipient: string;  // email / device_token
  title: string;
  body: string;
  // email
  template_id?: string;
  template_vars?: Record<string, any>;
  // push
  data?: Record<string, any>;
};

export class MessageDto {
  notification_id: string;
  type: 'email' | 'push';
  sender: string;
  recipient: string;  // email / device_token
  title: string;
  body: string;
  // push
  data?: Record<string, any>;
  created_at: string;
};
