import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { SendMailServiceProducer } from './jobs/SendMailServiceProducer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
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
    })
  ],
  controllers: [],
  providers: [SendMailServiceProducer],
})
export class AppModule {}
