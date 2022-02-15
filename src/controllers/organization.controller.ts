import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';
import {
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JWTGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';
import { CreateOrganizationDTO } from '../data-transfer-objects/create-organization.dto';

@Controller('organization')
@ApiTags('Organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseGuards(JWTGuard, AdminGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Bearer')
  createOrganization(@Body() parameters: CreateOrganizationDTO) {
    return this.organizationService.createOrganization(parameters);
  }
}
