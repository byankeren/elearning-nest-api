import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
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
    console.log(user)
    // If user validation failed
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create the payload for JWT
    const payload = { email: user.email, sub: user.id, role: user.role.slug };
    
    // Generate JWT and return it with the user details
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),  // expires in 1 hour
      user: user
    };
  }
}
