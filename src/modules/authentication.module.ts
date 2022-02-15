import { Module } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationController } from '../controllers/authentication.controller';
import { MongoModule } from './mondo.module';

@Module({
  imports: [MongoModule],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
