import { Controller } from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}
}
