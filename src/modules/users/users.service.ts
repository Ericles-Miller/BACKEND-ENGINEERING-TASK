import { Injectable } from '@nestjs/common';
import { UserDto } from './users.dto';

@Injectable()
export class UsersService {
  async create({ avatar, email, name, createdAt }: UserDto) {}
}
