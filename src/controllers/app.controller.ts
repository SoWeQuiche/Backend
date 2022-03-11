import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from '../services/app.service';

@Controller()
@ApiTags('Application')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint()
  @Get('apple-app-site-association')
  getAppleAppSiteAssociation() {
    return {
      applinks: {
        apps: [],
        details: [
          {
            appID: 'S4J5D3N22R.com.maxencemottard.swq',
            paths: ['/sign'],
          },
        ],
      },
      webcredentials: { apps: ['S4J5D3N22R.com.maxencemottard.swq'] },
    };
  }
}
