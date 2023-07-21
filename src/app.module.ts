import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    UsersModule,
    MulterModule.register({
      dest: null,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
