import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AttendanceRepository } from '../repositories/attendance.repository';

@Injectable()
export class UserAssociatedAttendanceGuard implements CanActivate {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const attendance = await this.attendanceRepository.findOneById(
      request.params.attendanceId,
    );

    if (!attendance) {
      return false;
    }

    // @ts-ignore
    return attendance.user.equals(request.user._id);
  }
}
