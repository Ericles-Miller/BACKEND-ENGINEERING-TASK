import { Injectable } from '@nestjs/common';
import { UserDto } from './users.dto';
import { PrismaService } from 'src/database/Prisma.client';
import { join } from 'path';
import * as fs from 'fs-extra';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  private prisma = new PrismaClient().user;

  async create(data: UserDto) {
    const emailAlreadyExists = await this.prisma.findFirst({
      where: {
        email: data.email,
      },
    });

    if (emailAlreadyExists) {
      throw new Error('email of user already exits!');
    }

    const user = await this.prisma.create({
      data,
    });

    return user;
  }

  async listAll() {
    const users = await this.prisma.findMany();
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
    const userALreadyExits = await this.prisma.findUnique({
      where: {id},
    });
    if(!userALreadyExits) {
      throw new Error('not exists user with id');
    }

    return await this.prisma.update({
      data,
      where: {id}
    })
  }

  async delete(id: string) {
    const userALreadyExits = await this.prisma.findUnique({
      where: {id},
    });
    if(!userALreadyExits) {
      throw new Error('not exists user with id');
    }

    return await this.prisma.delete({
      where: {id}
    })
  }

  async uploadFile(id: string, avatar: Express.Multer.File) {
    
    const userAlreadyExists = await this.prisma.findUnique({
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
    
    return this.prisma.update({
      data: {
        avatar: imagePath, // Salve o conteúdo do arquivo como uma string base64 no campo "avatar"
      },
      where: { id },
    });
  }
}

