import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/database/Prisma.client';
import { SendMailProducerService } from 'src/jobs/SendMailProducerService';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [BullModule.registerQueue({ name: 'sendMail-queue' })],
  controllers: [UsersController],
  providers: [UsersService,SendMailProducerService],
})
export class UsersModule {}
