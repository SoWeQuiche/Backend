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
import { TimeSlotService } from '../services/time-slot.service';
import { TimeSlotController } from '../controllers/time-slot.controller';
import { AttendanceService } from '../services/attendance.service';
import { AttendanceController } from '../controllers/attendance.controller';
import { NotificationService } from '../services/notification.service';
import { NotificationController } from '../controllers/notification.controller';

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
    AttendanceService,
    NotificationService,
  ],
  controllers: [
    AppController,
    AuthenticationController,
    OrganizationController,
    GroupController,
    TimeSlotController,
    AttendanceController,
    FileController,
    NotificationController,
  ],
})
export class AppModule {}
