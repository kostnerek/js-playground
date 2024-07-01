import { SetMetadata } from '@nestjs/common';

import { UserType } from '../../user/enums/user-type.enum';

export const AuthorizedUserType = (userTypes: UserType[]) =>
  SetMetadata('userTypes', userTypes);
