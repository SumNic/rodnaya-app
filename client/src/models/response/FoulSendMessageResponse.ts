export interface FoulSendMessageResponse {
    id: number;
    id_cleaner: number;
    id_foul_message: number;
    selectedRules: number[];
    selectedActionWithFoul: number;
    selectedPunishment: number;
    source: string;
    createdAt: number;
    updatedAt: number;
}