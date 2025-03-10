import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '@/src/contexts/prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { SanitizedUser } from './lib/types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    searchTerm: string | number,
    options: {
      findBy?: 'username' | 'id';
      throwNotFoundError?: boolean;
    }
  ): Promise<User> {
    let user: User;

    if (options.findBy === 'id') user = await this.findById(Number(searchTerm));
    if (options.findBy === 'username')
      user = await this.findByUsername(String(searchTerm));

    if (!user && options.throwNotFoundError) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: dto });

    return user;
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id }
    });
  }

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username }
    });
  }

  public sanitizeUser(user: User): SanitizedUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
