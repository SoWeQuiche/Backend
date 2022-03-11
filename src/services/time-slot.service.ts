import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as mjml2html from 'mjml';
import * as moment from 'moment';
import * as htmlToPdf from 'html-pdf';
import mongoose from 'mongoose';
import { TimeSlotDTO } from '../dto/time-slot.dto';
import { TimeSlot } from '../models/time-slot.model';
import { GroupRepository } from '../repositories/group.repository';
import { TimeSlotRepository } from '../repositories/time-slot.repository';
import { AWSService } from './aws.service';
import { Response } from 'express';
import { Stream } from 'stream';
import { NotificationService } from './notification.service';

@Injectable()
export class TimeSlotService {
  constructor(
    private readonly timeSlotRepository: TimeSlotRepository,
    private readonly groupRepository: GroupRepository,
    private readonly awsService: AWSService,
    private readonly notificationService: NotificationService,
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
      qrcodeSecret: crypto.randomUUID(),
      signCode: Math.random().toString().slice(2, 8),
    });
  };

  getAllGroupTimeSlots = async (groupId: string): Promise<TimeSlot[]> =>
    this.timeSlotRepository.findManyBy({
      group: new mongoose.Types.ObjectId(groupId),
    });

  getOneGroupTimeSlotById = async (timeSlotId: string): Promise<TimeSlot> =>
    this.timeSlotRepository.findOneBy({ _id: timeSlotId });

  getSignatureSheet = async (timeSlotId: string): Promise<Stream> => {
    const attendances = await this.timeSlotRepository.Model.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(timeSlotId) } },
      {
        $lookup: {
          from: 'attendances',
          localField: '_id',
          foreignField: 'timeSlot',
          as: 'attendance',
        },
      },
      { $unwind: { path: '$attendance', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'attendance.user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'files',
          localField: 'attendance.signFile',
          foreignField: '_id',
          as: 'signFile',
        },
      },
      { $unwind: { path: '$signFile', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          timeslotId: '$_id',
          groupId: '$group',
          startDate: 1,
          endDate: 1,
          isPresent: '$attendance.isPresent',
          signDate: '$attendance.signDate',
          signFileName: '$signFile.filename',
          lastname: '$user.lastname',
          firstname: '$user.firstname',
          _id: 0,
        },
      },
    ]);

    const metadata = await this.groupRepository.Model.aggregate([
      { $match: { _id: attendances[0]['groupId'] } },
      {
        $lookup: {
          from: 'organizations',
          localField: 'organization',
          foreignField: '_id',
          as: 'organization',
        },
      },
      { $unwind: '$organization' },
      {
        $project: {
          organizationId: '$organization._id',
          organizationName: '$organization.name',
          groupId: '$_id',
          groupName: '$name',
          _id: 0,
        },
      },
    ]);

    const organizationName =
      metadata[0]['organizationName'] || 'Unknown organization';
    const groupName = metadata[0]['groupName'] || 'Unknown group';
    const startDate =
      moment(attendances[0]['startDate']).format('YYYY/MM/DD hh:mm') ||
      'unknwon';
    const endDate =
      moment(attendances[0]['endDate']).format('YYYY/MM/DD hh:mm') || 'unknwon';

    const allSignatures = await Promise.all(
      attendances.map(async (attendance) => {
        const { Body: signFileBuffer } = await this.awsService.getFile(
          attendance.signFileName,
        );
        const fileBase64 = signFileBuffer.toString('base64');
        return `
        <tr  style="border-bottom:1px solid #cecece;">
          <td style="padding: 7px 15px 0 0;">${
            attendance.lastname + ' ' + attendance.firstname
          }</td>
          <td style="padding: 7px 15px; text-align: center;">
            <img src="data:image/png;base64,${fileBase64}" width="150"/>
          </td>
        </tr>
      `;
      }),
    );

    const mjmlOutput = mjml2html({
      tagName: 'mjml',
      attributes: {},
      children: [
        {
          tagName: 'mj-body',
          attributes: {},
          children: [
            {
              tagName: 'mj-section',
              attributes: {},
              children: [
                {
                  tagName: 'mj-column',
                  attributes: {},
                  children: [
                    {
                      tagName: 'mj-image',
                      attributes: {
                        width: '70px',
                        src: 'data:image/png;base64,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',
                      },
                    },
                    {
                      tagName: 'mj-text',
                      content: `
                        <h1 style="text-align: center">
                          Signature sheet
                        </h1>
                      `,
                    },
                    {
                      tagName: 'mj-spacer',
                      attributes: {
                        height: '20px',
                      },
                    },
                    {
                      tagName: 'mj-text',
                      content: `
                        <p><b>Organization</b>: ${organizationName}</p>
                        <p><b>Group</b>: ${groupName}</p>
                        <p><b>Time slot</b>: from ${startDate} to ${endDate}</p>
                      `,
                    },
                    {
                      tagName: 'mj-spacer',
                      attributes: {
                        height: '20px',
                      },
                    },
                    {
                      tagName: 'mj-table',
                      content: `
                        <tr style="border-bottom:1px solid #000;text-align:left;padding:15px 0;">
                          <th style="padding: 0 15px 0 0;">Lastname Firstname</th>
                          <th style="padding: 0 15px;">Signature</th>
                        </tr>
                        ${allSignatures} 
                      `,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    return new Promise((resolve, reject) => {
      htmlToPdf.create(mjmlOutput.html).toStream((err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(stream);
      });
    });
  };

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
      { $unwind: { path: '$timeSlot' } },
      {
        $addFields: {
          userId: userId,
        },
      },
      {
        $lookup: {
          from: 'attendances',
          localField: 'userId',
          foreignField: 'user',
          let: { userId: '$userId', timeSlotId: '$timeSlot._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$user', '$$userId'] },
                    { $eq: ['$timeSlot', '$$timeSlotId'] },
                  ],
                },
              },
            },
          ],
          as: 'attendance',
        },
      },
      { $unwind: { path: '$attendance', preserveNullAndEmptyArrays: true } },
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
    ]);

  notifyUsersToDefinePresence = async (timeSlotId: string): Promise<void> => {
    const timeSlot = await this.timeSlotRepository.getTimeSlotWithGroupUsers(
      timeSlotId,
    );

    if (timeSlot.isUsersNotified) {
      throw new BadRequestException('Users already notified');
    }

    timeSlot.group.users.forEach((user) => {
      this.notificationService.sendNotificationToUser(user.toString(), {
        threadId: 'attendance',
        title: `${timeSlot.group.name} has started`,
        body: 'Show your presence though the app',
      });
    });
  };
}
