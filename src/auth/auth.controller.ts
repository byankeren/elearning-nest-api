import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Use the LocalAuthGuard to validate the user credentials (email and password)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    // The loginDto is passed directly to the service
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
