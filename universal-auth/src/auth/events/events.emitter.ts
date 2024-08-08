import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AuthEventsTopics } from "./events";

@Injectable()
export class AuthEventsEmitter {
    constructor(private readonly eventEmitter: EventEmitter2) {}

    public emitUserVerifyAccount(payload: { email: string, url: string }) {
        Logger.log(`Emitting event ${AuthEventsTopics.AUTH_USER_VERIFY_ACCOUNT} with payload: ${JSON.stringify(payload)}`);
        this.eventEmitter.emit(AuthEventsTopics.AUTH_USER_VERIFY_ACCOUNT, payload);
    }
    
    public emitUserResetPassword(payload: { email: string, url: string }) {
        Logger.log(`Emitting event ${AuthEventsTopics.AUTH_USER_RESET_PASSWORD} with payload: ${JSON.stringify(payload)}`);
        this.eventEmitter.emit(AuthEventsTopics.AUTH_USER_RESET_PASSWORD, payload);
    }
}