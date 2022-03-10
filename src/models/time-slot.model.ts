import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Group } from './group.model';

export type TimeSlotDocument = TimeSlot & Document;

@Schema()
export class TimeSlot {
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: Group.name })
  group: Group;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  qrcodeSecret: string;

  @Prop({ required: true })
  signCode: string;

  @Prop({ select: false })
  __v: number;
}

export const TimeSlotSchema = SchemaFactory.createForClass(TimeSlot);
