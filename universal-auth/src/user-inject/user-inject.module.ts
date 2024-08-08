import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserInjectRepository } from './user-inject.repository';
import { UserInjectService } from './user.inject.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserInjectRepository, UserInjectService],
  exports: [UserInjectService],
})
export class UserInjectModule {}
