import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../config';
import { AuthenticationController } from '../controllers/authentication.controller';
import { AuthenticationService } from '../services/authentication.service';
import { MongoModule } from './mondo.module';
import { OrganizationController } from '../controllers/organization.controller';
import { OrganizationService } from 'src/services/organization.service';
import { AWSService } from '../services/aws.service';
import { FileController } from '../controllers/file.controller';

@Module({
  imports: [MongooseModule.forRoot(config.mongoUrl), MongoModule],
  providers: [AuthenticationService, OrganizationService, AWSService],
  controllers: [
    AppController,
    AuthenticationController,
    OrganizationController,
    FileController,
  ],
})
export class AppModule {}
