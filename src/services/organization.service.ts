import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../repositories/origanization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}
}
