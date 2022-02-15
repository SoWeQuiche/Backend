import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../config';
import { AuthenticationModule } from './authentication.module';

@Module({
  imports: [MongooseModule.forRoot(config.mongoUrl), AuthenticationModule],
  controllers: [AppController],
})
export class AppModule {}
