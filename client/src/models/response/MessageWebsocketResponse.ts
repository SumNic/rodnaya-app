export interface MessageWebsocketResponse {
	id_user: number;
	group_id?: number;
	first_name: string;
	last_name: string;
	photo_50: string;
	secret: string;
	location: string;
	form: {
		message: string;
		files: any;
		video?: string[];
	};
	id_message: number;
	resydency: string;
	createdAt: Date;
}
