import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import config from '../config';
import { FileRepository } from '../repositories/file.repository';

@Injectable()
export class AWSService {
  private readonly s3: S3;

  constructor(private readonly fileRepository: FileRepository) {
    this.s3 = new S3({
      accessKeyId: config.aws.id,
      secretAccessKey: config.aws.secret,
    });
  }

  uploadFile = async (file: Express.Multer.File, originUrl: string) => {
    const params = {
      Bucket: config.aws.bucketName,
      Key: file.originalname,
      Body: file.buffer,
    };

    try {
      const result = await this.s3.upload(params).promise();

      const url = `${originUrl}/files/${result.Key}`;

      return this.fileRepository.insert({
        url,
        filename: file.originalname,
        type: file.mimetype,
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  };

  getFile = async (key: string): Promise<S3.GetObjectOutput> => {
    const params = {
      Bucket: config.aws.bucketName,
      Key: key,
    };

    try {
      return this.s3.getObject(params).promise();
    } catch (e) {
      console.log(e);
      throw new NotFoundException();
    }
  };
}
