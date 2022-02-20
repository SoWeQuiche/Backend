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
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
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
  getGroupsForOrganization(@Param('organizationId') organizationId: string) {
    return this.groupService.getGroupsForOrganization(organizationId);
  }

  @Post('/organization/:organizationId')
  @UseGuards(JWTGuard, OrganizationAdminGuard)
  @ApiSecurity('Bearer')
  createGroup(
    @Param('organizationId') organizationId: string,
    @Body() parameters: NameDTO,
  ) {
    return this.groupService.createGroup(organizationId, parameters);
  }

  @Delete('/:groupId')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  deleteGroup(@Param('groupId') groupId: string) {
    return this.groupService.deleteGroup(groupId);
  }

  @Get('/:groupId/users')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  listGroupUsers(@Param('groupId') groupId: string) {
    return this.groupService.listGroupUsers(groupId);
  }

  @Post('/:groupId/users')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  addUser(@Param('groupId') groupId: string, @Body() parameters: MailDTO) {
    return this.groupService.addUser(groupId, parameters);
  }

  @Get('/:groupId/admins')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  listGroupAdmins(@Param('groupId') groupId: string) {
    return this.groupService.listGroupAdmins(groupId);
  }

  @Post('/:groupId/admins')
  @UseGuards(JWTGuard, GroupOrganizationAdminGuard)
  @ApiSecurity('Bearer')
  promoteToAdmin(
    @Param('groupId') groupId: string,
    @Body() parameters: MailDTO,
  ) {
    return this.groupService.promoteUser(groupId, parameters);
  }
}
