import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(input: Partial<UserDocument>): Promise<User> {
    return this.repository.create(input);
  }

  async changeStatus(id: string, status: string): Promise<User> {
    return this.repository.changeStatus(id, status);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.repository.findOneByEmail(email);
  }

  async findOneById(id: string): Promise<User> {
    return this.repository.findOneById(id);
  }

  async getOneById(id: string): Promise<User> {
    return this.repository.getOneById(id);
  }

  async getOneByEmail(email: string): Promise<User> {
    return this.repository.getOneByEmail(email);
  }

  async deleteOneById(id: string): Promise<User> {
    return this.repository.deleteOneById(id);
  }
}
