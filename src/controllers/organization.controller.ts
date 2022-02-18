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
import { NameDTO } from '../dto/name.dto';
import { OrganizationAdminGuard } from '../guards/organization-admin.guard';
import { MailDTO } from '../dto/mail.dto';

@Controller('organizations')
@ApiTags('Organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @UseGuards(JWTGuard)
  @ApiSecurity('Bearer')
  listManagedOrganizations(@Req() request) {
    return this.organizationService.listManagedOrganizations(request.user);
  }

  @Post()
  @UseGuards(JWTGuard, AdminGuard)
  @ApiSecurity('Bearer')
  createOrganization(@Body() parameters: NameDTO) {
    return this.organizationService.createOrganization(parameters);
  }

  @Get('/:organizationId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  listGroups(@Param('organizationId') organizationId: string) {
    return this.organizationService.getOrganizationDetails(organizationId);
  }

  @Delete('/:organizationId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  deleteOrganization(@Param('organizationId') organizationId: string) {
    return this.organizationService.deleteOrganization(organizationId);
  }

  @Post('/:organizationId/promote')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  promoteToAdmin(
    @Param('organizationId') organizationId: string,
    @Body() parameters: MailDTO,
  ) {
    return this.organizationService.promoteUser(organizationId, parameters);
  }

  @Post('/:organizationId/users')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  addUser(
    @Param('organizationId') organizationId: string,
    @Body() parameters: MailDTO,
  ) {
    return this.organizationService.addUser(organizationId, parameters);
  }
}
