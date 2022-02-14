import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import { User, UserDocument } from '../models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {
    super(model);
  }
}
