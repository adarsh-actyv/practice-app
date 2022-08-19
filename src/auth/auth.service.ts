import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthSignUpDto, AuthSignInDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(dto: AuthSignUpDto) {
    try {
      // generate password hash
      const hash = await argon.hash(dto.password);

      // save new user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
        },
      });

      // return the saved user
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already in use');
        }
      }
      throw error;
    }
  }

  public async signIn(dto: AuthSignInDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // if the user is not found, throw exception
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // compare password
    const passwordMatches = await argon.verify(user.hash, dto.password);

    // if the password is incorrect, throw exception
    if (!passwordMatches) {
      throw new ForbiddenException('Email or Password is incorrect');
    }

    // send back the user
    return this.signToken(user.id, user.email);
  }

  protected async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret,
    });

    return { access_token: `Bearer ${token}` };
  }
}
