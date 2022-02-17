import { Injectable } from '@nestjs/common';
import BaseRepository from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from '../models/file.model';

@Injectable()
export class FileRepository extends BaseRepository<FileDocument> {
  @InjectModel(File.name) private model: Model<FileDocument>;

  constructor(@InjectModel(File.name) model: Model<FileDocument>) {
    super(model);
    this.model = model;
  }
}
