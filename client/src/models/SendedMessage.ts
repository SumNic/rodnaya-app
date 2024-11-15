import { MessageForm } from "./MessageForm";

export interface SendedMessage {
    id_user: number,
    secret: string, 
    location: string, 
    form: MessageForm
}