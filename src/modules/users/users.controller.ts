import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './users.dto';

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

  @Put(':userId')
  async updateUser(userId: string, @Body() data: UserDto) {
    return this.usersService.create(data);
  }
}
