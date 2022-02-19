import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from '../controllers/app.controller';
import config from '../config';
import { AuthenticationController } from '../controllers/authentication.controller';
import { AuthenticationService } from '../services/authentication.service';
import { MongoModule } from './mongo.module';
import { OrganizationController } from '../controllers/organization.controller';
import { OrganizationService } from '../services/organization.service';
import { AWSService } from '../services/aws.service';
import { FileController } from '../controllers/file.controller';
import { GroupController } from '../controllers/group.controller';
import { GroupService } from '../services/group.service';
import { AppService } from '../services/app.service';
import { MailService } from '../services/mail.service';
import { TimeSlotService } from 'src/services/time-slot.service';
import { TimeSlotController } from 'src/controllers/time-slot.controller';

@Module({
  imports: [MongooseModule.forRoot(config.mongoUrl), MongoModule],
  providers: [
    AppService,
    AuthenticationService,
    OrganizationService,
    GroupService,
    AWSService,
    MailService,
    TimeSlotService,
  ],
  controllers: [
    AppController,
    AuthenticationController,
    OrganizationController,
    GroupController,
    FileController,
    TimeSlotController,
  ],
})
export class AppModule {}
