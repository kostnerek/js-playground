import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string): Promise<User> {
    return this.userService.getOneByEmail(email);
  }
}
