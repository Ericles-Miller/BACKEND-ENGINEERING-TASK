import { HttpException, Injectable } from '@nestjs/common';
import { UserDto } from './users.dto';
import { PrismaService } from 'src/database/Prisma.client';
import { join } from 'path';
import * as fs from 'fs-extra';
import { log } from 'console';

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
    for (const user of users) {
      if (user.avatar) {
        const imagePath = join(__dirname,'..','..', '..', 'tmp', `${user.name}.png`);
        const buffer = await fs.readFile(imagePath);
        user.avatar = buffer.toString('base64');
      }
    }

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

  async uploadFile(id: string, avatar: Express.Multer.File) {
    
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: { id },
    });
    console.log(avatar);
    if (!userAlreadyExists) {
      throw new Error('User with the provided ID does not exist!');
    }

    const uploadDir = join(__dirname, '..','..', '..', 'tmp');
    const imagePath = join(uploadDir, `${userAlreadyExists.name}.png`);

    await fs.ensureDir(uploadDir); // Certifique-se de que o diretório existe
    await fs.writeFile(imagePath, avatar.buffer); // Salve o buffer do arquivo no diretório desejado
    
    return this.prisma.user.update({
      data: {
        avatar: imagePath, // Salve o conteúdo do arquivo como uma string base64 no campo "avatar"
      },
      where: { id },
    });
  }
}

