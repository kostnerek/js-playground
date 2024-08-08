import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserStatus } from '../enums/user-status.enum';
import { UserType } from '../enums/user-type.enum';
import { UserAuthType } from '../enums/user-auth-type.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ type: String })
  email: string;  

  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String })
  picture: string;

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

  @Prop({
    type: [String],
    required: true,
    enum: UserAuthType,
  })
  authType: UserAuthType[];
}

export const UserSchema = SchemaFactory.createForClass(User);
