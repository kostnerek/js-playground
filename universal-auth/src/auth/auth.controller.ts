import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleOAuthGuard } from "./guards/google.guard";
import { GoogleStrategy } from "./strategy/google.strategy";
import { FacebookGuard } from "./guards/facebok.guard";
import { UserAuthType } from "src/user/enums/user-auth-type.enum";
import { Public } from "src/decorators/public.decorator";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { User } from "src/user/schemas/user.schema";
import { InjectUser } from "src/decorators/user.decorator";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly googleStrategy: GoogleStrategy) {}
    

    @Post('register')
    @Public()
    async register(@Body() body: RegisterDto) {
        return await this.authService.register(body);
    }

    @Post('login')
    @Public()
    async login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }


    @Post('reset-password')
    @Public()
    async resetPassword(@Body() body: ResetPasswordDto, @InjectUser() user: User) {
        console.log(user);
        await this.authService.resetPassword(body.email);
        return {message: 'Password reset link has been sent to your email'};
    }

    @Post('change-password')
    @Public()
    async changePassword(@Body() body: ChangePasswordDto) {
        await this.authService.changePassword(body.id, body.token, body.password);
        return {message: 'Password has been changed'};
    }


    //external authorization services

    @UseGuards(GoogleOAuthGuard)
    @Get('google')
    @Public()
    async googleLogin() {}
    
    @Get('google/redirect')
    @Public()
    async googleRedirect(@Query() query: any) {
        const userData = await this.googleStrategy.getUserDataWithCode(decodeURIComponent(query.code));
        const serializedUserData = this.authService.serializeExternalAuthData(userData);
        return await this.authService.externalAuth(serializedUserData, UserAuthType.Google);
    }

    @Get("facebook")
    @Public()
    @UseGuards(FacebookGuard)
    async facebookLogin(): Promise<any> {}

    @Get("facebook/redirect")
    @Public()
    @UseGuards(FacebookGuard)
    async facebookLoginRedirect(@Req() req: Request & {user:any}): Promise<any> {
        const serializedUserData = this.authService.serializeExternalAuthData(req.user.user);
        return this.authService.externalAuth(serializedUserData, UserAuthType.Facebook);
    }
}