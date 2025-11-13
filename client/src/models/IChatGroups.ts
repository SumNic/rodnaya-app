import { GroupMessage } from '../services/GroupsService';

export interface IGroupMessage {
	locality: GroupMessage[];
	region: GroupMessage[];
	country: GroupMessage[];
	world: GroupMessage[];
}
