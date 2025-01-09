import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  // Validate user credentials
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;  // Don't return the password
      return result;
    }
    return null;  // Return null if user is not found or password doesn't match
  }

  // Login logic: Validate user and return JWT
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    // Fetch the role permissions from the role_permissions table
    const rolePermissions = await this.prisma.role_permissions.findMany({
      where: {
        role_id: user.role_id, // Assuming user has a role_id field
      },
      include: {
        permission: true, // Include the permission details
      },
    });

    // console.log(rolePermissions)
  
    // Extract the permissions' slugs (or IDs, depending on your design)
    const permissions = rolePermissions.map(rp => rp.permission.slug);

    // Create the payload for JWT, including permissions
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role.slug,
      permissions: permissions, // Add the permissions to the JWT payload
    };
    // Generate JWT and return the token with user details
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }), // expires in 1 hour
      user: user,
    };
  }
  
}
