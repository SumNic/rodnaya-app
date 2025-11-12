import { Group } from '../services/GroupsService';
import { CreateLocationDto } from '../services/MessagesService';
import { DeclarationUser } from './DeclarationUser';
import { EndReadMessage } from './EndReadMessage';
// import { LocationUser } from './LocationUser';
// import { IGroup } from './response/IGroup';

export interface IUser {
	id: number;
	vk_id: number;
	first_name: string;
	last_name: string;
	photo_50: string;
	photo_max: string;
	isDelProfile: boolean;
	isRegistration: boolean;
	dateEditResidency: Date;
	residency: CreateLocationDto;
	secret: string;
	declaration: DeclarationUser;
	endReadMessage: EndReadMessage[];
	blocked: boolean;
	blockedforever: boolean;
	blockeduntil: Date;
	userGroups: Group[];
	tg_id?: number;
}
