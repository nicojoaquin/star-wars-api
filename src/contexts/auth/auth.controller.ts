import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Login (Public)'
  })
  @Post('login')
  @Public()
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @ApiOperation({
    summary: 'Sign Up (Public)',
    description: 'Create an account'
  })
  @Post('register')
  @Public()
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }
}
