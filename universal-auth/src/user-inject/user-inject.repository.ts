import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class UserInjectRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findById(userId: string): Promise<UserDocument> {
    const userFromDb = await this.userModel.findById(userId);
    if (userFromDb) {
      return userFromDb;
    }

    throw new NotFoundException('User not found');
  }
}
