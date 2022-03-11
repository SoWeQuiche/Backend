import { Injectable } from '@nestjs/common';
import { UserDevice, DeviceDocument } from '../models/user-device.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import BaseRepository from './base.repository';

@Injectable()
export class DeviceRepository extends BaseRepository<DeviceDocument> {
  constructor(
    @InjectModel(UserDevice.name) private deviceModel: Model<DeviceDocument>,
  ) {
    super(deviceModel);
  }
}
