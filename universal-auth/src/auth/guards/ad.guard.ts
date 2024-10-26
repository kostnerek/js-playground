import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdGuard extends AuthGuard('azure_ad_oauth2') {}
