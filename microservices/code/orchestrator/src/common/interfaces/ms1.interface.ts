import { QueueMessage } from "./queueMessage.interface";

export const MS1_HELLO_WORLD = 'MS1_HELLO_WORLD'
export interface Ms1HelloWorldMessage extends QueueMessage {
    messageName: typeof MS1_HELLO_WORLD,
    messagePayload: {
        message: string
    }
}