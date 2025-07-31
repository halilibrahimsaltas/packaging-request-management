import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string, includePassword: boolean = false): Promise<UserResponseDto | User> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Return raw entity if password is needed (for auth)
    if (includePassword) {
      return user;
    }

    // Return DTO for normal operations
    return plainToInstance(UserResponseDto, user);
  }

  async getUsers({ page = 1, limit = 10, sort = 'id', order = 'DESC' }): Promise<UserResponseDto[]> {
    const offset = (page - 1) * limit;
    const users = await this.userRepository
      .createQueryBuilder('user')
      .orderBy(`user.${sort}`, order.toUpperCase() as 'ASC' | 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();
    
    return plainToInstance(UserResponseDto, users);
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return plainToInstance(UserResponseDto, user);
  }

  async updateUser(id: number, updateUserDto: Partial<UpdateUserDto>): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = crypto.createHash('sha256').update(updateUserDto.password).digest('hex');
    }

    Object.assign(user, updateUserDto);
    const savedUser = await this.userRepository.save(user);
    return plainToInstance(UserResponseDto, savedUser);
  }

  async deleteUser(id: number): Promise<{message: string}> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

  async createUser(user: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email }
    });

    if (existingUser) {
      throw new ConflictException('This email address is already in use');
    }

    const hashedPassword = crypto.createHash('sha256').update(user.password).digest('hex');
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword
    });

    const savedUser = await this.userRepository.save(newUser);
    return plainToInstance(UserResponseDto, savedUser);
  }
}
