import { Injectable } from "@nestjs/common";
import { MailNotificationService } from "./mail-notifications.service";
import { OnEvent } from "@nestjs/event-emitter";
import { AuthEventsTopics } from "src/auth/events/events";

@Injectable()
export class NotificationEventListener {
    constructor(private readonly mailer: MailNotificationService) {}

    @OnEvent(AuthEventsTopics.AUTH_USER_VERIFY_ACCOUNT)
    public handleUserVerifyAccount(payload: { email: string, url: string }) {
        this.mailer.sendUserVerifyAccountEmail(payload.email, payload.url);
    }
    
    @OnEvent(AuthEventsTopics.AUTH_USER_RESET_PASSWORD)
    public handleUserResetPassword(payload: { email: string, url: string }) {
        this.mailer.sendUserResetPasswordEmail(payload.email, payload.url);
    }
}