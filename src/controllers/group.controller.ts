import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
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

@Controller('groups')
@ApiTags('Group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('/:groupId/promote')
  @UseGuards(JWTGuard, GroupAdminGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Bearer')
  promoteToAdmin(
    @Param('groupId') groupId: string,
    @Body() parameters: MailDTO,
  ) {
    return this.groupService.promoteUser(groupId, parameters);
  }

  @Post('/:groupId/users')
  @UseGuards(JWTGuard, GroupAdminGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiSecurity('Bearer')
  addUser(@Param('groupId') groupId: string, @Body() parameters: MailDTO) {
    return this.groupService.addUser(groupId, parameters);
  }
}
