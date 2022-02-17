import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {
  _id: Types.ObjectId;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  url: string;

  @Prop({ select: false })
  __v: number;
}

export const FileSchema = SchemaFactory.createForClass(File);
