import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfos(): string {
    return 'SWQ API';
  }
}
