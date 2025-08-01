import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserFilterDto } from './dto/user-filter.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private mapToUserResponseDto(user: User): UserResponseDto {
    const { password, ...userResponse } = user;
    return userResponse as UserResponseDto;
  }

  async getUsers(filter: UserFilterDto): Promise<UserResponseDto[]> {
    const {
      page = 1,
      limit = 10,
      sort = 'id',
      order = 'DESC',
      role,
    } = filter;
  
    const offset = (page - 1) * limit;
  
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .orderBy(`user.${sort}`, order)
      .skip(offset)
      .take(limit);
  
      // role filter
    if (role && role.length > 0) {
      queryBuilder.andWhere('user.role IN (:...roles)', { roles: role });
    }
  
    const users = await queryBuilder.getMany();
    return users.map(user => this.mapToUserResponseDto(user));
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToUserResponseDto(user);
  }

  async updateUser(id: number, updateUserDto: Partial<UpdateUserDto>): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const savedUser = await this.userRepository.save(user);
    return this.mapToUserResponseDto(savedUser);
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

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({
      ...user,
      password: hashedPassword
    });

    const savedUser = await this.userRepository.save(newUser);
    return this.mapToUserResponseDto(savedUser);
  }

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
    return this.mapToUserResponseDto(user);
  }

}
