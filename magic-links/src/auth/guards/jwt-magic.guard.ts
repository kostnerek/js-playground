import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { UserType } from '../../user/enums/user-type.enum';

@Injectable()
export class JwtMagicGuard extends AuthGuard('jwt-magic') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const canActivateResult = await super.canActivate(context);
      if (!canActivateResult) {
        return false;
      }

      const userTypes = this.reflector.get<UserType[]>(
        'userTypes',
        context.getHandler(),
      );
      if (userTypes?.length && !userTypes.includes(request.user.userType)) {
        return false;
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
