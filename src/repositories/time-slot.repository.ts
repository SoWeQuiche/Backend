import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TimeSlot, TimeSlotDocument } from '../models/time-slot.model';

@Injectable()
export class TimeSlotRepository extends BaseRepository<TimeSlotDocument> {
  constructor(
    @InjectModel(TimeSlot.name) private model: Model<TimeSlotDocument>,
  ) {
    super(model);
  }

  async getTimeSlotWithGroupUsers(timeSlotId: string) {
    return this.Model.findById(timeSlotId).populate('group', 'users');
  }
}
