export interface FoulSendMessage {
    id_cleaner: number;
    id_foul_message: number;
    selectedRules: number[];
    selectedActionWithFoul: number;
    selectedPunishment: number;
    source: string;
}