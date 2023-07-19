import { HttpException, Injectable } from '@nestjs/common';
import { UserDto } from './users.dto';
import { PrismaService } from 'src/database/Prisma.client';
import { createWriteStream, mkdirSync, existsSync  } from 'fs';
import { join } from 'path';

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
    const usersWithAvatars = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    // Mapeie os usuários para adicionar o avatar em formato base64
    const usersWithAvatarsAsBase64 = usersWithAvatars.map(user => ({
      ...user,
      avatar: user.avatar ? user.avatar.toString() : null,
    }));

    return usersWithAvatarsAsBase64;
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

  async uploadFile(id: string, avatar: Buffer) {
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userAlreadyExists) {
      throw new Error('User with the provided ID does not exist!');
    }

    // Adicione esta validação para verificar o tipo MIME da imagem
    const supportedImageTypes = ['image/png', 'image/jpeg'];
    const imageType = avatar.slice(0, 4).toString('hex');
    if (!supportedImageTypes.includes(imageType)) {
      throw new HttpException('Invalid image format. Only PNG and JPEG images are supported.', HttpStatus.BAD_REQUEST);
    }

    const avatarBase64 = avatar.toString('base64');

    return this.prisma.user.update({
      data: {
        avatar: avatarBase64,
      },
      where: { id },
    });
  }
}

