import { Injectable } from '@nestjs/common';
import { TimeSlotDTO } from 'src/dto/time-slot.dto';
import { TimeSlot } from 'src/models/time-slot.model';
import { TimeSlotRepository } from 'src/repositories/time-slot.repository';

@Injectable()
export class TimeSlotService {
  constructor(private readonly timeSlotRepository: TimeSlotRepository) {}

  insertTimeSlot = async (
    groupId: string,
    parameters: TimeSlotDTO,
  ): Promise<TimeSlot> =>
    this.timeSlotRepository.insert({ groupId, ...parameters });

  getAllGroupTimeSlots = async (groupId: string): Promise<TimeSlot[]> =>
    this.timeSlotRepository.findManyBy({
      groupId,
    });

  getOneGroupTimeSlotById = async (timeSlotId: string): Promise<TimeSlot> =>
    this.timeSlotRepository.findOneBy({
      _id: timeSlotId,
    });

  updateOneGroupTimeSlotById = async (
    conditions: {
      groupId: string;
      timeSlotId: string;
    },
    set: TimeSlotDTO,
  ): Promise<boolean> =>
    this.timeSlotRepository.updateOneBy(
      {
        groupeId: conditions.groupId,
        timeSlotId: conditions.timeSlotId,
      },
      { ...set },
    );

  deleteOneGroupTimeSlotById = async (timeSlotId: string): Promise<boolean> =>
    this.timeSlotRepository.deleteOnyBy({ timeSlotId });

  getUserTimeSlots = async (userId: string): Promise<TimeSlot[]> =>
    this.timeSlotRepository.findManyBy({ userId });
}
