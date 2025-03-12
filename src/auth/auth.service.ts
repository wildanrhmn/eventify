import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../services/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { LoginInput } from './inputs/auth.input';
import { AuthResponse } from './models/auth.model';
import { UserType } from '../models/user.model';
import { mapToGraphQLType } from '../utils/type-mappers';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.validateUser(loginInput.email, loginInput.password);
    
    const payload = { email: user.email, sub: user.id };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: mapToGraphQLType<UserType>(user),
    };
  }
}
