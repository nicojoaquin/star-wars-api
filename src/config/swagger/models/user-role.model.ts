import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserRoleEnum {
  @ApiProperty({
    description: 'User Role',
    enum: UserRole,
    example: UserRole.Regular
  })
  type: UserRole;
}
