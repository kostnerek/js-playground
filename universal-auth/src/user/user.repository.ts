import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(input: Partial<UserDocument>): Promise<User> {
    return this.userModel.create(input);
  }

  async upsert(entity: Partial<UserDocument>): Promise<User> {
    const _id = entity.id || new Types.ObjectId;
    const update = { $set: entity };

    const options = { 
      upsert: true, 
      new: true, 
      setDefaultsOnInsert: true 
    };

    const upsertedDocument = await this.userModel.findOneAndUpdate(
      { _id },
      update,
      options
    ).exec();

    if (!upsertedDocument) {
      throw new Error('Upsert operation failed');
    }

    return upsertedDocument;
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
