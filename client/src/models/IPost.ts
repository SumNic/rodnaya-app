import { IFiles } from './IFiles.ts';

export interface IPost {
	id: number;
	groupId?: number;
	message: string;
	location: string;
	blocked: boolean;
	userId: number;
	files?: IFiles[];
	user: {
		id: number;
		first_name: string;
		last_name: string;
		photo_50: string;
	};
	createdAt: Date;
}
