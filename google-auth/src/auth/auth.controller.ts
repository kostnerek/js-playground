import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleOAuthGuard } from "./guards/google.guard";
import { GoogleStrategy } from "./strategy/google.strategy";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly googleStrategy: GoogleStrategy) {}
    
    @UseGuards(GoogleOAuthGuard)
    @Get('google')
    async login() {}
    
    @Get('google/redirect')
    async googleRedit(@Query() query: any) {
        const userData = await this.googleStrategy.getUserDataWithCode(decodeURIComponent(query.code));
        return await this.authService.googleAuth(userData);
    }
}