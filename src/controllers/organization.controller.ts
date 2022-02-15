import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';
import {
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JWTGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';
import { NameDTO } from '../data-transfer-objects/name.dto';
import { OrganizationAdminGuard } from '../guards/organization-admin.guard';

@Controller('organizations')
@ApiTags('Organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @UseGuards(JWTGuard, AdminGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Bearer')
  createOrganization(@Body() parameters: NameDTO) {
    return this.organizationService.createOrganization(parameters);
  }

  @Post('/:organizationId/groups')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Bearer')
  createGroup(
    @Param('organizationId') organizationId: string,
    @Body() parameters: NameDTO,
  ) {
    return this.organizationService.createGroup(organizationId, parameters);
  }

  @Delete('/:organizationId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Bearer')
  deleteOrganization(@Param('organizationId') organizationId: string) {
    return this.organizationService.deleteGroup(organizationId);
  }

  @Get('/managed')
  @UseGuards(JWTGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Bearer')
  listManagedOrganizations(@Req() request) {
    return this.organizationService.listManagedOrganizations(request.user);
  }

  @Get('/:organizationId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Bearer')
  listGroups(@Param('organizationId') organizationId: string) {
    return this.organizationService.getOrganizationDetails(organizationId);
  }
}
