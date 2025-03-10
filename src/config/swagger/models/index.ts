import { ApiProperty } from '@nestjs/swagger';

import { UserRoleEnum } from './user-role.model';

export class Enums {
  @ApiProperty({ type: UserRoleEnum })
  userRole: UserRoleEnum;
}

export const EXTRA_MODELS = [Enums];
