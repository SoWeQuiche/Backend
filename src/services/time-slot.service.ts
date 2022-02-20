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

  getUserTimeSlots = async (userId: string) => {
    const userGroups = await this.groupRepository.findManyBy({
      users: {
        $in: userId,
      },
    });

    const allTimeSlots = await Promise.all(
      userGroups.map((group) => this.getAllGroupTimeSlots(group._id)),
    );

    return allTimeSlots.flat();
  };
}
