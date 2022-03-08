import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { TimeSlotDTO } from '../dto/time-slot.dto';
import { TimeSlot } from '../models/time-slot.model';
import { User } from '../models/user.model';
import { GroupRepository } from '../repositories/group.repository';
import { TimeSlotRepository } from '../repositories/time-slot.repository';

@Injectable()
export class TimeSlotService {
  constructor(
    private readonly timeSlotRepository: TimeSlotRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  insertTimeSlot = async (
    groupId: string,
    parameters: TimeSlotDTO,
  ): Promise<TimeSlot> => {
    const groupObjectId = new mongoose.Types.ObjectId(groupId);

    const concurentTimeSlot = await this.timeSlotRepository.findManyBy({
      group: groupObjectId,
      startDate: {
        $gte: parameters.startDate,
      },
      endDate: {
        $lte: parameters.endDate,
      },
    });

    if (concurentTimeSlot.length > 0) {
      throw new ConflictException('Overlapping another existing Time Slot');
    }

    return this.timeSlotRepository.insert({
      group: groupObjectId,
      ...parameters,
    });
  };

  getAllGroupTimeSlots = async (groupId: string): Promise<TimeSlot[]> =>
    this.timeSlotRepository.findManyBy({
      group: new mongoose.Types.ObjectId(groupId),
    });

  getOneGroupTimeSlotById = async (timeSlotId: string): Promise<TimeSlot> =>
    this.timeSlotRepository.findOneBy({ _id: timeSlotId });

  updateOneGroupTimeSlotById = async (
    timeSlotId: string,
    set: TimeSlotDTO,
  ): Promise<void> => {
    const existingTimeSlot = await this.timeSlotRepository.findOneById(
      timeSlotId,
    );

    if (!existingTimeSlot) {
      throw new NotFoundException();
    }

    const concurentTimeSlot = await this.timeSlotRepository.findManyBy({
      _id: {
        $ne: existingTimeSlot._id,
      },
      group: existingTimeSlot.group,
      startDate: {
        $gte: set.startDate,
      },
      endDate: {
        $lte: set.endDate,
      },
    });

    if (concurentTimeSlot.length > 0) {
      throw new ConflictException('Overlapping another existing Time Slot');
    }

    existingTimeSlot.startDate = new Date(set.startDate);
    existingTimeSlot.endDate = new Date(set.endDate);

    existingTimeSlot.save();
  };

  deleteOneGroupTimeSlotById = async (timeSlotId: string): Promise<boolean> =>
    this.timeSlotRepository.deleteOnyBy({ _id: timeSlotId });

  getUserTimeSlots = async (userId: string): Promise<any[]> =>
    this.groupRepository.Model.aggregate([
      { $match: { users: { $in: [userId] } } },
      {
        $lookup: {
          from: 'timeslots',
          localField: '_id',
          foreignField: 'group',
          as: 'timeSlot',
        },
      },
      { $unwind: { path: '$timeSlot', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'attendances',
          localField: 'timeSlot._id',
          foreignField: 'timeSlot',
          as: 'attendance',
        },
      },
      { $unwind: { path: '$attendance', preserveNullAndEmptyArrays: true } }, // TODO: trouver une solution pour ne pas supprimer les éléments qui n'ont pas d'attendance à l'application de l'unwind
      {
        $project: {
          _id: 0,
          groupName: '$name',
          organizationId: '$organization',
          groupId: '$_id',
          timeSlotId: '$timeSlot._id',
          attendanceId: '$attendance._id',
          endDate: '$timeSlot.endDate',
          startDate: '$timeSlot.startDate',
          isPresent: '$attendance.isPresent',
          signDate: '$attendance.signDate',
        },
      },
      {
        $project: {
          name: 0,
          timeSlot: 0,
          attendance: 0,
        },
      },
    ]);
}
