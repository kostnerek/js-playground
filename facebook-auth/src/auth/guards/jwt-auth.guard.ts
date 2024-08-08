import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { decode } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
   
    const request = context.switchToHttp().getRequest();

    if (request.headers.authorization) {
      const { userId } = decode(
        request.headers.authorization.split(' ')[1],
      ) as {
        userId: string;
      };
      request.user = { id: userId };
    }

    try {
      const canActivateResult = await super.canActivate(context);
      if (!canActivateResult) {
        return false;
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
