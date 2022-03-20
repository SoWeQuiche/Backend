import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import * as sharp from 'sharp';
import { ApiFile } from '../decorators/ApiFile';
import { JWTGuard } from '../guards/jwt.guard';
import { AWSService } from '../services/aws.service';

@Controller('files')
@ApiTags('File')
export class FileController {
  constructor(private readonly awsService: AWSService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JWTGuard)
  @ApiConsumes('multipart/form-data')
  @ApiFile('file')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Upload a file',
    description: 'Allow to upload the image of the signature of a user.',
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Missing file');
    }

    if (file.mimetype.includes('image/')) {
      const resizedFileBuffer = await sharp(file.buffer)
        .resize({ width: 500 })
        .toBuffer();

      return this.awsService.uploadFile({
        originalname: file.originalname,
        buffer: resizedFileBuffer,
        mimetype: file.mimetype,
      });
    }

    return this.awsService.uploadFile({
      originalname: file.originalname,
      buffer: file.buffer,
      mimetype: file.mimetype,
    });
  }

  @Get(':key')
  @UseGuards(JWTGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Get the signature of a user',
    description: 'Get the signature of a user.',
  })
  async getFile(@Param('key') key: string, @Res() res) {
    const file = await this.awsService.getFile(key);

    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(file.Body);
  }
}
