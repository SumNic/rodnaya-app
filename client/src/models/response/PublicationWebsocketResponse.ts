export interface PublicationWebsocketResponse {
    id_user: number;
    first_name: string,
    last_name: string,
    photo_50: string,
    secret: string;
    location: string;
    form: {
        message: string;
        files: any;
    };
    id_publication: number;
    resydency: {
        locality: string;
        region: string;
        country: string;
    };
    createdAt: Date
}