import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.model';

export type OrganizationDocument = Organization & Document;

@Schema()
export class Organization {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: [Types.ObjectId], ref: User.name })
  admins: Types.ObjectId[];

  @Prop({ required: true, type: [Types.ObjectId], ref: User.name })
  users: Types.ObjectId[];

  @Prop({ select: false })
  __v: number;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
