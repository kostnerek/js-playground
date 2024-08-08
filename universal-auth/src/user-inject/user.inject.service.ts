import { Injectable } from '@nestjs/common';

import { UserInjectRepository } from './user-inject.repository';

@Injectable()
export class UserInjectService {
  constructor(private readonly repository: UserInjectRepository) {}

  async findById(userId: string) {
    return this.repository.findById(userId);
  }
}
