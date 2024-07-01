import { Module } from '@nestjs/common';
import { MailNotificationService } from './mail-notifications.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [MailNotificationService],
  exports: [MailNotificationService],
})
export class NotificationsModule {}
