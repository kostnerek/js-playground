import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { FacebookGuard } from "./guards/facebok.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Get("facebook")
    @UseGuards(FacebookGuard)
    async facebookLogin(): Promise<any> {}

    @Get("facebook/redirect")
    @UseGuards(FacebookGuard)
    async facebookLoginRedirect(@Req() req: Request & {user:any}): Promise<any> {
        console.log(req.user.user)
        return this.authService.facebookAuth(req.user.user);
    }
    
}