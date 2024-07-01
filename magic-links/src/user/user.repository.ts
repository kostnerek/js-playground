import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(input: Partial<UserDocument>): Promise<User> {
    return this.userModel.create(input);
  }

  async changeStatus(id: string, status: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async findOneById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async getOneById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async deleteOneById(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id);
  }
}
