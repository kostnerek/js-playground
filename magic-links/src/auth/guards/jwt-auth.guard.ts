import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { decode } from 'jsonwebtoken';

import { UserType } from '../../user/enums/user-type.enum';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    if (isPublic) {
      if (request.headers.authorization) {
        const { userId, userType } = decode(
          request.headers.authorization.split(' ')[1],
        ) as {
          userId: string;
          userType: UserType;
        };
        request.user = { id: userId, userType };
      }
      return true;
    }

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
      console.error(err);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
