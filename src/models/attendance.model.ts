import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { File } from './file.model';
import { TimeSlot } from './time-slot.model';
import { User } from './user.model';

export type AttendanceDocument = Attendance & Document;

@Schema()
export class Attendance {
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: TimeSlot.name })
  timeSlot: TimeSlot;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: Types.ObjectId, ref: File.name, unique: true, sparse: true })
  signFile: File;

  @Prop()
  isPresent: boolean;

  @Prop()
  signDate: Date;

  @Prop({ select: false })
  __v: number;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
