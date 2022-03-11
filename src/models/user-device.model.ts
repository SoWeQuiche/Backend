import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.model';

export type DeviceDocument = UserDevice & Document;

@Schema()
export class UserDevice {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user: User;

  @Prop()
  deviceId: string;

  @Prop()
  platform: string;
}

export const DeviceSchema = SchemaFactory.createForClass(UserDevice);
