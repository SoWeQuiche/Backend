import { Injectable } from '@nestjs/common';
import { Provider, Notification as NodeApnNotification } from 'apn';
import mongoose from 'mongoose';
import { UserDevice } from '../models/user-device.model';
import { UserDeviceDto } from '../dto/user-device.dto';
import { DeviceRepository } from '../repositories/user-device.repository';
import { UserRepository } from '../repositories/user.repository';
import config from '../config';
import { User } from '../models/user.model';

@Injectable()
export class NotificationService {
  private apnProvider: Provider;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly deviceRepository: DeviceRepository,
  ) {
    this.apnProvider = new Provider({
      token: {
        key: config.swa.certKey,
        keyId: config.swa.keyId,
        teamId: config.swa.teamId,
      },
      production: true,
    });
  }

  registerUserDevice = async (
    userId: string,
    data: UserDeviceDto,
  ): Promise<UserDevice> => {
    const deviceAlreadySaved = await this.deviceRepository.findOneBy({
      user: new mongoose.Types.ObjectId(userId),
      deviceId: data.deviceId,
    });

    if (deviceAlreadySaved) {
      return deviceAlreadySaved;
    }

    return this.deviceRepository.insert({
      user: userId,
      ...data,
    });
  };

  getUserDevices = async (userId: string): Promise<UserDevice[]> =>
    this.deviceRepository.findManyBy({
      user: new mongoose.Types.ObjectId(userId),
    });

  getUserDeviceById = async (
    userId: string,
    deviceId: string,
  ): Promise<UserDevice[]> =>
    this.deviceRepository.findManyBy({
      _id: new mongoose.Types.ObjectId(deviceId),
      user: new mongoose.Types.ObjectId(userId),
    });

  deleteUserDeviceById = async (
    userId: string,
    deviceId: string,
  ): Promise<boolean> =>
    this.deviceRepository.deleteOnyBy({
      _id: new mongoose.Types.ObjectId(deviceId),
      user: new mongoose.Types.ObjectId(userId),
    });

  sendNotificationToUser = async (
    userId: string,
    data: {
      threadId: string;
      title: string;
      body: string;
      payload?: Record<string, any>;
    },
  ): Promise<void> => {
    const devices = await this.deviceRepository.findManyBy({
      user: new mongoose.Types.ObjectId(userId),
    });

    const notification = new NodeApnNotification();
    notification.topic = config.swa.appId;
    notification.expiry = Math.floor(Date.now() / 1000) + 3600;
    notification.sound = 'ping.aiff';
    notification.alert = {
      body: data.body,
      title: data.title,
    };
    notification.threadId = data.threadId;
    notification.payload = data.payload ?? {};

    devices.forEach((device) => {
      this.apnProvider.send(notification, device.deviceId);
    });
  };
}
