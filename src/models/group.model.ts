import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.model';
import { Organization } from './organization.model';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
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

  @Prop({ required: true, type: Types.ObjectId, ref: Organization.name })
  organization: Types.ObjectId;

  @Prop({ select: false })
  __v: number;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
