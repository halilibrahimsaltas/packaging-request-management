import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../common/enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

interface RequestWithUser extends Request {
  user: {
    sub: number; // JWT' from the user ID
    email: string;
    role: UserRole;
  };
}

@Injectable()
export class OwnerOrRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) throw new ForbiddenException('User not authenticated.');

    const allowedRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If roles is not defined, check if the user is the owner of the resource
    if (!allowedRoles) {
      // Check if user is accessing their own data
      if (request.body?.customerId) {
        return user.sub === request.body.customerId;
      }
      if (request.body?.supplierId) {
        return user.sub === request.body.supplierId;
      }
      // Check id parameter from URL
      const paramId = request.params.id;
      if (paramId) {
        return user.sub === Number(paramId);
      }
      // Check customerId parameter from URL
      const customerId = request.params.customerId;
      if (customerId) {
        return user.sub === Number(customerId);
      }
      // Check supplierId parameter from URL
      const supplierId = request.params.supplierId;
      if (supplierId) {
        return user.sub === Number(supplierId);
      }
      // Default: allow access to own resources
      return true;
    }

    const isRoleAllowed = allowedRoles.includes(user.role);
    const isOwner = this.checkOwnership(request, user.sub);

    if (isOwner || isRoleAllowed) return true;

    throw new ForbiddenException(
      'You do not have permission to access this resource. Only the owner or users with specific roles can perform this action.',
    );
  }

  private checkOwnership(request: RequestWithUser, userId: number): boolean {
    // Check body parameters
    if (request.body?.customerId) {
      return userId === request.body.customerId;
    }
    if (request.body?.supplierId) {
      return userId === request.body.supplierId;
    }
    
    // Check URL parameters
    const paramId = request.params.id;
    if (paramId) {
      return userId === Number(paramId);
    }
    
    const customerId = request.params.customerId;
    if (customerId) {
      return userId === Number(customerId);
    }
    
    const supplierId = request.params.supplierId;
    if (supplierId) {
      return userId === Number(supplierId);
    }
    
    return false;
  }
}
