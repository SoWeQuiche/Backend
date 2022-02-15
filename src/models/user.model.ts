import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  mail: string;

  @Prop({ select: false, required: true })
  password: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ select: false })
  __v: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
