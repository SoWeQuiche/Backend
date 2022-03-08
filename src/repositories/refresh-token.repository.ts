import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../models/refresh-token.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshTokenDocument> {
  constructor(
    @InjectModel(RefreshToken.name) private model: Model<RefreshTokenDocument>,
  ) {
    super(model);
  }
}
