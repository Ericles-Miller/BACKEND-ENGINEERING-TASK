import { Injectable } from '@nestjs/common';
import { UserDto } from './users.dto';
import { PrismaService } from 'src/database/Prisma.client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: UserDto) {
    const emailAlreadyExists = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (emailAlreadyExists) {
      throw new Error('email of user already exits!');
    }

    const user = await this.prisma.user.create({
      data,
    });

    return user;
  }
}
