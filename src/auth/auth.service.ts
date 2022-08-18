import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  public signUp() {
    return { message: 'Sign Up' };
  }

  public signIn() {
    return { message: 'Sign In' };
  }
}
