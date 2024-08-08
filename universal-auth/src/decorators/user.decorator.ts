import {
  ArgumentMetadata,
  ExecutionContext,
  Injectable,
  PipeTransform,
  createParamDecorator,
} from '@nestjs/common';

import { UserInjectService } from 'src/user-inject/user.inject.service';

@Injectable()
export class GetUserDataPipe implements PipeTransform {
  constructor(private readonly userInjectService: UserInjectService) {}
  async transform(value: string, _metadata: ArgumentMetadata) {
    if (value) {
      return this.userInjectService.findById(value);
    }
    return null;
  }
}

export const GetUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req?.user?.id ?? undefined;
});

export const InjectUser = (additionalOptions?: any) => GetUser(additionalOptions, GetUserDataPipe);
