import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/user/enums/user-type.enum';

export const AuthorizedUserType = (userTypes: UserType[]) =>
  SetMetadata('userTypes', userTypes);
