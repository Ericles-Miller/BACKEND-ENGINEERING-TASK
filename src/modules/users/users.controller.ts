import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { log } from 'console';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post()
  async create(@Body() data: UserDto) {
    return this.usersService.create(data);
  }

  @Get()
  async listAll() {
    return this.usersService.listAll();
  }

  @Patch(':userId')
  async updateUser(@Param('userId') userId: string, @Body() data: UserDto) {
    return this.usersService.update(userId, data);
  }

  @Delete(':userId')
  async delete(@Param('userId') userId: string ) {
    return this.usersService.delete(userId);
  }

  @Post('/uploadAvatar/:userId')
  @UseInterceptors(FileInterceptor('file')) // file name
  async uploadAvatar(@UploadedFile() file: any, @Param() userId:string) {
    console.log(file);
    
  }
}
