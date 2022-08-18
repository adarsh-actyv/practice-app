import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  public signUp() {
    return { message: 'Sign Up' };
  }

  public signIn() {
    return { message: 'Sign In' };
  }
}
