import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ select: false })
  __v: number;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
