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

  async listAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async update(id: string, data: UserDto) {
    const userALreadyExits = await this.prisma.user.findUnique({
      where: {id},
    });
    if(!userALreadyExits) {
      throw new Error('not exists user with id');
    }

    return await this.prisma.user.update({
      data,
      where: {id}
    })
  }

  async delete(id: string) {
    const userALreadyExits = await this.prisma.user.findUnique({
      where: {id},
    });
    if(!userALreadyExits) {
      throw new Error('not exists user with id');
    }

    return await this.prisma.user.delete({
      where: {id}
    })
  }


}
