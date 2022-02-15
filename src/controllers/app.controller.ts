import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from 'src/services/app.service';

@Controller()
@ApiTags('Application')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getInfos(): string {
    return this.appService.getInfos();
  }

  @Get('apple-app-site-association')
  getAppleAppSiteAssociation() {
    return {
      applinks: {
        apps: [],
        details: [
          {
            appID: 'S4J5D3N22R.com.maxencemottard.swq',
          },
        ],
      },
      webcredentials: { apps: ['S4J5D3N22R.com.maxencemottard.swq'] },
    };
  }
}
