import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
