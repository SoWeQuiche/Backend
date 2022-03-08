import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.model';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema()
export class RefreshToken {
  _id: Types.ObjectId;

  @Prop({ unique: true, required: true })
  token: string;

  @Prop({ required: true })
  expirationDate: number;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user: string;

  @Prop({ required: true, default: true })
  active: boolean;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
