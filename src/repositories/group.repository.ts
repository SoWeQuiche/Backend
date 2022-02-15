import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from '../models/Group.model';

@Injectable()
export class GroupRepository extends BaseRepository<GroupDocument> {
  constructor(@InjectModel(Group.name) private model: Model<GroupDocument>) {
    super(model);
  }
}
