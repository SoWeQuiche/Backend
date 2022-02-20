import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { PatchingTimeSlotDTO } from 'src/dto/patching-time-slot.dto';
import { TimeSlotDTO } from 'src/dto/time-slot.dto';
import { TimeSlot } from 'src/models/time-slot.model';
import { User } from 'src/models/user.model';
import { GroupRepository } from 'src/repositories/group.repository';
import { TimeSlotRepository } from 'src/repositories/time-slot.repository';

@Injectable()
export class TimeSlotService {
  constructor(
    private readonly timeSlotRepository: TimeSlotRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  insertTimeSlot = async (
    groupId: string,
    parameters: TimeSlotDTO,
  ): Promise<TimeSlot> =>
    this.timeSlotRepository.insert({
      group: new mongoose.Types.ObjectId(groupId),
      ...parameters,
    });

  getAllGroupTimeSlots = async (groupId: string): Promise<TimeSlot[]> =>
    this.timeSlotRepository.findManyBy({
      group: new mongoose.Types.ObjectId(groupId),
    });

  getOneGroupTimeSlotById = async (timeSlotId: string): Promise<TimeSlot> =>
    this.timeSlotRepository.findOneBy({ _id: timeSlotId });

  updateOneGroupTimeSlotById = async (
    conditions: { timeSlotId: string },
    set: PatchingTimeSlotDTO,
  ): Promise<boolean> =>
    this.timeSlotRepository.updateOneBy(
      {
        _id: conditions.timeSlotId,
      },
      {
        ...set,
        group: set.groupdId
          ? new mongoose.Types.ObjectId(set.groupdId)
          : undefined,
      },
    );

  deleteOneGroupTimeSlotById = async (timeSlotId: string): Promise<boolean> =>
    this.timeSlotRepository.deleteOnyBy({ _id: timeSlotId });

  getUserTimeSlots = async (user: User) => {
    const userGroups = await this.groupRepository.findManyBy({
      users: {
        $in: user._id,
      },
    });

    const allTimeSlots = await Promise.all(
      userGroups.map((group) =>
        this.getAllGroupTimeSlots(group._id),
      ),
    );

    return allTimeSlots.flat();
  };
}
