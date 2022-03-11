import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeviceDocument = UserDevice & Document;

@Schema()
export class UserDevice {
  @Prop()
  userId: string;

  @Prop()
  deviceId: string;

  @Prop()
  deviceType: string;
}

export const DeviceSchema = SchemaFactory.createForClass(UserDevice);
