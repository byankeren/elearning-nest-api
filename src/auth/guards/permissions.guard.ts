import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler()) || [];
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('user', user)
    // Allow access if no permissions are required (default behavior)
    if (requiredPermissions.length === 0) {
      return true;
    }

    // Super Admin has all permissions, bypass permission checks
    if (user && user.role === 'super-admin') {
      return true;
    }

    // Check if the user has the required permissions
    if (!user || !requiredPermissions.every(permission => user.permissions.includes(permission))) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
