import { MessageForm } from "./MessageForm";

export interface Publication {
    id_user: number,
    secret: string, 
    // location: string, 
    form: MessageForm
}