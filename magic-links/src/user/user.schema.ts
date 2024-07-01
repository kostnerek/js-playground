import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserType } from './enums/user-type.enum';
import { UserStatus } from './enums/user-status.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ type: String, required: false })
  hash: string;

  @Prop({
    type: String,
    enum: UserType,
    required: true,
    default: UserType.User,
  })
  type: UserType;

  @Prop({
    type: String,
    required: true,
    enum: UserStatus,
    default: UserStatus.CREATED,
  })
  status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
