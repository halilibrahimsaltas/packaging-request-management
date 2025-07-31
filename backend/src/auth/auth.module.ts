import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './roles/jwt-auth.guard';
import { RolesGuard } from './roles/roles.guard';
import { OwnerOrRolesGuard } from './roles/owner-or-roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard, OwnerOrRolesGuard, JwtStrategy],
  exports: [AuthService, JwtAuthGuard, RolesGuard, OwnerOrRolesGuard],
})
export class AuthModule {}
