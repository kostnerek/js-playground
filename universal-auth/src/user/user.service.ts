import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDocument, User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(input: Partial<UserDocument>): Promise<User> {
    return this.repository.create(input);
  }

  async upsert(input: Partial<UserDocument>): Promise<User> {
    return this.repository.upsert(input);
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
