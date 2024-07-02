import {
  ArgumentMetadata,
  ExecutionContext,
  Injectable,
  PipeTransform,
  createParamDecorator,
} from '@nestjs/common';

import { UserService } from '../user/user.service';

@Injectable()
export class GetUserDataPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}
  async transform(value: string, _metadata: ArgumentMetadata) {
    _metadata;
    if (value) {
      return this.userService.findOneById(value);
    }
    return null;
  }
}

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    _data;
    const request = ctx.switchToHttp().getRequest();
    return request?.user?.id ?? undefined;
  },
);

export const InjectUser = (additionalOptions?: any) =>
  GetUser(additionalOptions, GetUserDataPipe);
