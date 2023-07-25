import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { SendMailProducerService } from './SendMailProducerService';
import { SendMailConsumer } from './SendMailConsumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sendMail-queue',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_PASS,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
  ],
  providers: [SendMailProducerService, SendMailConsumer],
  exports: [SendMailProducerService], // Exporte o serviço para que possa ser usado em outros módulos
})
export class SendMailModule {}