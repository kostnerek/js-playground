import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AllLanguages } from 'common/interfaces/lang.interface';

export const GetUserLang = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const allowedKeys = AllLanguages.map((lang) => lang.toString());

    let userLang = 'en';
    try {
      if (allowedKeys.includes(req.headers['accept-language'].split(',')[0])) {
        userLang = req.headers['accept-language'].split(',')[0];
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
    return userLang;
  },
);

export const UserLang = (additionalOptions?: any) =>
  GetUserLang(additionalOptions);

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export interface RequestModel extends Request {
  userLang: string;
}

@Injectable()
export class LangMiddleware implements NestMiddleware {
  use(req: RequestModel, res: Response, next: NextFunction) {
    const allowedKeys = AllLanguages.map((lang) => lang.toString());

    let userLang = 'en';
    try {
      if (allowedKeys.includes(req.headers['accept-language'].split(',')[0])) {
        userLang = req.headers['accept-language'].split(',')[0];
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log('Error:', error);
    }
    req.userLang = userLang;
    next();
  }
}
