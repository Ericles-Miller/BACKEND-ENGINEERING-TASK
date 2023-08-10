import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Express } from 'express'
import { SendMailProducerService } from 'src/jobs/SendMailProducerService';

@Controller('/users')
export class UsersController {
  constructor(
    private sendMailService: SendMailProducerService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() data: UserDto) {
    await this.sendMailService.sendMail(data);
    const user = await this.usersService.create(data);

    return user;
  }

  @Get()
  async listAll(@Res() response: Response) {
    const users = await this.usersService.listAll();
    return response.json(users);
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
    
    return { message: 'Send file with success!' };
  }
}


