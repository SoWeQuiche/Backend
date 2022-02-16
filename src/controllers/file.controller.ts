import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AWSService } from '../services/aws.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiFile } from '../decorators/ApiFile';
import { JWTGuard } from '../guards/jwt.guard';

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
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.awsService.uploadFile(file, req.get('origin'));
  }

  @Get(':key')
  @UseGuards(JWTGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiSecurity('Bearer')
  async getFile(@Param('key') key: string, @Res() res) {
    const file = await this.awsService.getFile(key);

    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(file.Body);
  }
}
