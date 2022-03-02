import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from '../models/attendance.model';

@Injectable()
export class AttendanceRepository extends BaseRepository<AttendanceDocument> {
  constructor(
    @InjectModel(Attendance.name)
    private model: Model<AttendanceDocument>,
  ) {
    super(model);
  }

  async isSignFileAreadyUseForSignAnAttendance(
    userId: string,
    signFileId: string,
  ) {
    const attendanceSignWithSameSignFileCount = await this.Model.countDocuments(
      {
        signFile: signFileId,
      },
    );

    return attendanceSignWithSameSignFileCount > 0;
  }
}
