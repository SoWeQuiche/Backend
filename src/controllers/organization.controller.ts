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
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Bearer')
  listManagedOrganizations(@Req() request) {
    return this.organizationService.listManagedOrganizations(request.user);
  }

  @Post()
  @UseGuards(JWTGuard, AdminGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Bearer')
  createOrganization(@Body() parameters: NameDTO) {
    return this.organizationService.createOrganization(parameters);
  }

  @Get('/:organizationId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Bearer')
  listGroups(@Param('organizationId') organizationId: string) {
    return this.organizationService.getOrganizationDetails(organizationId);
  }

  @Delete('/:organizationId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Bearer')
  deleteOrganization(@Param('organizationId') organizationId: string) {
    return this.organizationService.deleteGroup(organizationId);
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

  @Post('/:organizationId/promote')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Bearer')
  promoteToAdmin(
    @Param('organizationId') organizationId: string,
    @Body() parameters: MailDTO,
  ) {
    return this.organizationService.promoteUser(organizationId, parameters);
  }

  @Post('/:organizationId/users')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Bearer')
  addUser(
    @Param('organizationId') organizationId: string,
    @Body() parameters: MailDTO,
  ) {
    return this.organizationService.addUser(organizationId, parameters);
  }
}
