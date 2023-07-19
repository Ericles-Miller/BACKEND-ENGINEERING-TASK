import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDTO } from './upload.dto';
import { Response } from 'express';
import multer from 'multer';

const upload = multer({
  dest:"./tmp", // dir do arquivo 
})

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
  async uploadAvatar(@UploadedFile() file: UploadDTO, @Param('id') id: string) {
    await this.usersService.uploadFile(id, file.buffer);
    return { message: 'Arquivo enviado com sucesso!' };
  }
}
