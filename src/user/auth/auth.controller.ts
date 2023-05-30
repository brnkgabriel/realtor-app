import { Body, Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ProductKeyDto, SigninDto, SignupDto } from '../dtos/auth.dto'; 
import { User, iUser } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('signup')
  async signup(
    @Body() body: SignupDto
  ) {
    return this.authService.signup(body)
  }

  @Post('signin') 
  signin(
    @Body() body: SigninDto
  ) {
    return this.authService.signin(body)
  }

  @Post('key')
  generateProductKey(
    @Body() body: ProductKeyDto
  ) {
    return this.authService.generateProductKey(body)
  }

  @Get('me')
  me(
    @User() user: iUser
  ) {
    return user
  }
}
