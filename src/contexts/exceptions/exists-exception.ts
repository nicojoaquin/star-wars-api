import { ConflictException } from '@nestjs/common';

import { Utils } from '../lib/utils';

export class ExistsException extends ConflictException {
  constructor(entity: string, prop: string) {
    super({
      message: `${Utils.upperFirst(entity)} with this ${prop} already exists`,
      error: 'ExistingResource',
      statusCode: 409
    });
  }
}
