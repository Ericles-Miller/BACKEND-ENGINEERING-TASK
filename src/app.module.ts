import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { SendMailModule } from './jobs/sendMail.module';
import { SendMailProducerService } from './jobs/SendMailProducerService';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { SendMailConsumer } from './jobs/SendMailConsumer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    SendMailModule,
    MulterModule.register({
      dest: null,
    }),
    // import do bullModule 
    BullModule.forRoot({
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
        }
      } 
    }),
    BullModule.registerQueue({
      name: 'sendMail-queue',
    }), 
  ],
  controllers: [UsersController],
  providers: [SendMailProducerService,SendMailConsumer, UsersService]
})

export class AppModule {}
