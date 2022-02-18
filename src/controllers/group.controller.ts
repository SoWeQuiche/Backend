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
import {
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MailDTO } from '../dto/mail.dto';
import { GroupService } from '../services/group.service';
import { GroupAdminGuard } from '../guards/group-admin.guard';
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
  @UseGuards(JWTGuard, GroupAdminGuard)
  @ApiSecurity('Bearer')
  deleteGroup(@Param('groupId') groupId: string) {
    return this.groupService.deleteGroup(groupId);
  }

  @Post('/:groupId/promote')
  @UseGuards(JWTGuard, GroupAdminGuard)
  @ApiSecurity('Bearer')
  promoteToAdmin(
    @Param('groupId') groupId: string,
    @Body() parameters: MailDTO,
  ) {
    return this.groupService.promoteUser(groupId, parameters);
  }

  @Post('/:groupId/users')
  @UseGuards(JWTGuard, GroupAdminGuard)
  @ApiSecurity('Bearer')
  addUser(@Param('groupId') groupId: string, @Body() parameters: MailDTO) {
    return this.groupService.addUser(groupId, parameters);
  }
}
