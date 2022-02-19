import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TimeSlotDocument = TimeSlot & Document;

@Schema()
export class TimeSlot {
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: Group.name })
  @Prop({ required: true })
  group: Group;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const TimeSlotSchema = SchemaFactory.createForClass(TimeSlot);
