import { ChatGroup } from '../services/GroupsService';

export interface IChatGroup {
	locality: ChatGroup[];
	region: ChatGroup[];
	country: ChatGroup[];
	world: ChatGroup[];
}
