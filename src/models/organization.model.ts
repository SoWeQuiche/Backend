import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.model';
import { Group } from './group.model';

export type OrganizationDocument = Organization & Document;

@Schema()
export class Organization {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    type: [Types.ObjectId],
    ref: User.name,
    default: [],
    select: false,
  })
  admins: Types.ObjectId[];

  @Prop({
    required: true,
    type: [Types.ObjectId],
    ref: User.name,
    default: [],
    select: false,
  })
  users: Types.ObjectId[];

  @Prop({
    required: true,
    type: [Types.ObjectId],
    ref: Group.name,
    default: [],
    select: false,
  })
  groups: Types.ObjectId[];

  @Prop({ select: false })
  __v: number;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
