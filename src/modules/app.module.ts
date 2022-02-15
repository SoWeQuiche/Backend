import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../config';
import { AuthenticationController } from '../controllers/authentication.controller';
import { AuthenticationService } from '../services/authentication.service';
import { MongoModule } from './mondo.module';

@Module({
  imports: [MongooseModule.forRoot(config.mongoUrl), MongoModule],
  providers: [AuthenticationService],
  controllers: [AppController, AuthenticationController],
})
export class AppModule {}
