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
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { OrganizationService } from '../services/organization.service';
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
  @ApiOperation({
    summary: 'List all the organization managed by a user',
    description: 'List all the organization managed by a user.',
  })
  listManagedOrganizations(@Req() request) {
    return this.organizationService.listManagedOrganizations(request.user);
  }

  @Post()
  @UseGuards(JWTGuard, AdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Create an organization',
    description: 'Create an organization.',
  })
  createOrganization(@Body() parameters: NameDTO) {
    return this.organizationService.createOrganization(parameters);
  }

  @Get('/:organizationId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'List all groups of an organization',
    description:
      'List all groups of an organization depending of organization ID.',
  })
  listGroups(@Param('organizationId') organizationId: string) {
    return this.organizationService.getOrganizationDetails(organizationId);
  }

  @Delete('/:organizationId')
  @UseGuards(JWTGuard, AdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Delete an organization',
    description: 'Delete an organization.',
  })
  deleteOrganization(@Param('organizationId') organizationId: string) {
    return this.organizationService.deleteOrganization(organizationId);
  }

  @Get('/:organizationId/users')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'List all users of an organization',
    description: 'List all users of an organization.',
  })
  listOrganizationUsers(@Param('organizationId') organizationId: string) {
    return this.organizationService.listOrganizationUsers(organizationId);
  }

  @Post('/:organizationId/users')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Add a user for an organization',
    description: 'Add a user for an organization.',
  })
  addUser(
    @Param('organizationId') organizationId: string,
    @Body() parameters: MailDTO,
  ) {
    return this.organizationService.addUser(organizationId, parameters);
  }

  @Delete('/:organizationId/users/:userId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Delete a user of an organization',
    description:
      'Delete a user of an organization depending of the user and organization ID.',
  })
  removeUser(
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string,
  ) {
    return this.organizationService.removeUser(organizationId, userId);
  }

  @Get('/:organizationId/admins')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'List all admins of an organization',
    description: 'List all admins of an organization.',
  })
  listOrganizationAdmins(@Param('organizationId') organizationId: string) {
    return this.organizationService.listOrganizationAdmins(organizationId);
  }

  @Post('/:organizationId/admins')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Promote an user for administrate an organization',
    description: 'Give admin privilege to an user for an organization.',
  })
  promoteToAdmin(
    @Param('organizationId') organizationId: string,
    @Body() parameters: MailDTO,
  ) {
    return this.organizationService.promoteUser(organizationId, parameters);
  }

  @Delete('/:organizationId/admins/:userId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Remove admin privilege for a user',
    description: 'Remove admin privilege to a user of an organization.',
  })
  removeAdmin(
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string,
  ) {
    return this.organizationService.removeAdmin(organizationId, userId);
  }
}
