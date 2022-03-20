import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JWTGuard } from '../guards/jwt.guard';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { MailDTO } from '../dto/mail.dto';
import { GroupService } from '../services/group.service';
import { GroupOrganizationAdminGuard } from '../guards/group-organization-admin.guard';
import { OrganizationAdminGuard } from '../guards/organization-admin.guard';
import { NameDTO } from '../dto/name.dto';

@Controller('groups')
@ApiTags('Group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get('/organization/:organizationId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Get all the groups for a organization',
    description: 'Get all the groups depends of an organization ID.',
  })
  getGroupsForOrganization(@Param('organizationId') organizationId: string) {
    return this.groupService.getGroupsForOrganization(organizationId);
  }

  @Post('/organization/:organizationId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Create a group for an organization',
    description: 'Create a group for an organization.',
  })
  createGroup(
    @Param('organizationId') organizationId: string,
    @Body() parameters: NameDTO,
  ) {
    return this.groupService.createGroup(organizationId, parameters);
  }

  @Get('/:groupId')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Get informations of a group',
    description: 'Get informations of a group by his ID.',
  })
  getGroupDetails(@Param('groupId') groupId: string) {
    return this.groupService.getGroupDetails(groupId);
  }

  @Delete('/:groupId')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Delete a group',
    description: 'Delete a group by his ID.',
  })
  deleteGroup(@Param('groupId') groupId: string) {
    return this.groupService.deleteGroup(groupId);
  }

  @Get('/:groupId/users')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'List all users of a group',
    description: 'List all users of a group depending of a group ID.',
  })
  listGroupUsers(@Param('groupId') groupId: string) {
    return this.groupService.listGroupUsers(groupId);
  }

  @Post('/:groupId/users')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Add an user to a group',
    description: 'Add an user to a group.',
  })
  addUser(@Param('groupId') groupId: string, @Body() parameters: MailDTO) {
    return this.groupService.addUser(groupId, parameters);
  }

  @Delete('/:groupId/users/:userId')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Delete a user of a group',
    description:
      'Delete a user of a group depending of the user and the group ID.',
  })
  removeUser(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return this.groupService.removeUser(groupId, userId);
  }

  @Get('/:groupId/admins')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'List all admins of a group',
    description: 'List all admins of a group.',
  })
  listGroupAdmins(@Param('groupId') groupId: string) {
    return this.groupService.listGroupAdmins(groupId);
  }

  @Post('/:groupId/admins')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Promote an user to admin of a group',
    description:
      'Promote an user by his email to admin of a group, depending of the group ID.',
  })
  promoteToAdmin(
    @Param('groupId') groupId: string,
    @Body() parameters: MailDTO,
  ) {
    return this.groupService.promoteUser(groupId, parameters);
  }

  @Delete('/:groupId/admins/:userId')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  @ApiOperation({
    summary: 'Delete admin privilege',
    description: 'Delete admin privilege for an user and for a group.',
  })
  removeAdmin(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return this.groupService.removeAdmin(groupId, userId);
  }
}
