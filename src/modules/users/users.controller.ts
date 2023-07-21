import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Express } from 'express'
import * as multer from 'multer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() data: UserDto) {
    return this.usersService.create(data);
  }

  @Get()
  async listAll(@Res() response: Response) {
    const users = await this.usersService.listAll();
    response.setHeader('Content-Type', 'application/json');
    response.send(users);
  }

  @Patch(':userId')
  async updateUser(@Param('userId') userId: string, @Body() data: UserDto) {
    return this.usersService.update(userId, data);
  }

  @Delete(':userId')
  async delete(@Param('userId') userId: string ) {
    return this.usersService.delete(userId);
  }

  @Patch('/uploadAvatar/:id')
  @UseInterceptors(FileInterceptor('file')) // file name
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Param('id') id: string) {
    await this.usersService.uploadFile(id, file);
    
    return { message: 'Arquivo enviado com sucesso!' };
  }
}


