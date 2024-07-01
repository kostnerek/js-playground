import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document } from 'mongoose';
import { TokenType } from './tokens.types';

export type TokenDocument = Token & Document;

@Schema({ timestamps: true })
export class Token {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  })
  user: string;

  @Prop({
    type: Date,
    required: true,
  })
  revokeDate: Date;

  @Prop({
    required: true,
    enum: TokenType,
  })
  tokenType: TokenType;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
TokenSchema.index({ revokeDate: 1 }, { expires: 0 });
