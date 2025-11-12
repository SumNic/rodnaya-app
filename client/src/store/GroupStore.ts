import { makeAutoObservable } from 'mobx';
import { CreateGroupDto } from '../models/CreateGroupDto';
import GroupsService, { CreatePostToChatDto, Group } from '../services/GroupsService';
// import { IGroup } from '../models/response/IGroup';
import { CountNoReadPostsGroups } from '../models/CountNoReadPostsGroups';
import { EndReadPostsGroupsId } from '../models/EndReadPostsGroupsId';
import { Source } from '../utils/types';

export default class GroupStore {
	isModalNewGroupOpen: boolean = false;
	isAboutGroupVisible = new Map<string, boolean>();
	// isAboutGroupVisible: Record<string, boolean> = observable.object({});
	isChatGroupVisible: Record<string, boolean> = {};
	aboutGroup: Record<string, Group | undefined> = {};
	source: Record<string, Source> = {};
	groupForChat: Record<string, Group> = {};

	arrCountNoReadPostsGroups: CountNoReadPostsGroups[] = [];
	arrLastReadPostsGroupsId: EndReadPostsGroupsId[] = [];
	isChangeGroups: boolean = false;

	constructor() {
		makeAutoObservable(this);
	}

	setIsModalNewGroupOpen(bool: boolean) {
		this.isModalNewGroupOpen = bool;
	}

	setIsAboutGroupVisible = (location: string, bool: boolean) => {
		this.isAboutGroupVisible.set(location, bool);
		// this.isAboutGroupVisible[location] = bool;
	};

	setIsChatGroupVisible = (location: string, bool: boolean) => {
		this.isChatGroupVisible[location] = bool;
	};

	setAboutGroup = (location: string, group: Group | undefined) => {
		this.aboutGroup[location] = group;
	};

	setSource = (location: string, source: Source | '') => {
		this.source[location] = source;
	};

	setGroupForChat = (location: string, group: Group) => {
		this.groupForChat[location] = group;
	};

	updateArrCountNoReadPostsGroups = (idGroup: number, count: number) => {
		const existingEntry = this.arrCountNoReadPostsGroups.find((item) => item.idGroup === idGroup);
		if (existingEntry) {
			existingEntry.count = count;
		} else {
			// Если записи нет, добавляем новую
			this.arrCountNoReadPostsGroups.push({ idGroup, count });
		}
	};

	updateArrLastReadPostsGroupsId(idGroup: number, idLastReadPost: number) {
		const existingEntry = this.arrLastReadPostsGroupsId.find((item) => item.idGroup === idGroup);
		if (existingEntry) {
			existingEntry.idLastReadPost = idLastReadPost;
		} else {
			// Если записи нет, добавляем новую
			this.arrLastReadPostsGroupsId.push({ idGroup, idLastReadPost });
		}
	}

	getCountNoReadPostsGroups = async () => {
		try {
			const result = await GroupsService.getCountNoReadPostsGroups();
			if (result.data) {
				result.data.forEach((elem) => {
					this.updateArrCountNoReadPostsGroups(elem.idGroup, elem.count);
				});
			}
		} catch (e: any) {
			console.log(`Ошибка в getCountNoReadPostsGroup: ${e}`);
			// return { data: e.response?.data?.message };
		}
	};

	getLastReadPostsGroupsId = async () => {
		try {
			const result = await GroupsService.getLastReadPostsGroupsId();
			if (result.data) {
				result.data.map((elem) => {
					this.updateArrLastReadPostsGroupsId(elem.idGroup, elem.idLastReadPost);
				});
			}
		} catch (e: any) {
			console.log(`Ошибка в getLastReadMessageId: ${e}`);
			// return { data: e.response?.data?.message };
		}
	};

	async updateEndReadPostsGroupsIdInBackEnd(idGroup: number, idLastReadPost: number) {
		try {
			await GroupsService.setLastReadPostsGroupsId(idGroup, idLastReadPost);
		} catch (error) {
			console.error(`Ошибка в updateEndReadMessagesIdInBackEnd: ${error}`);
		}
	}

	async createGroup(dto: CreateGroupDto) {
		try {
			const response = await GroupsService.createGroup(dto);
			return { data: response.data };
		} catch (e: any) {
			return { error: e.response?.data?.message };
		}
	}

	async getAllGroup(location: string) {
		try {
			const response = await GroupsService.getAllGroups(location);
			return { data: response.data };
		} catch (e: any) {
			return { error: e.response?.data?.message };
		}
	}

	async getOneGroup(id: number) {
		try {
			const response = await GroupsService.getGroupFromId(id);
			return { data: response.data };
		} catch (e: any) {
			return { error: e.response?.data?.message };
		}
	}

	async sendPostToChat(dto: CreatePostToChatDto) {
		try {
			const response = await GroupsService.sendPost(dto);
			return { data: response.data };
		} catch (e: any) {
			return { error: e.response?.data?.message };
		}
	}

	joinTheGroup = async (id: number) => {
		try {
			await GroupsService.joinTheGroup(id);
			this.setIsChangeGroups(!this.isChangeGroups);
		} catch (e: any) {
			return { error: e.response?.data?.message };
		}
	};

	leaveTheGroup = async (id: number) => {
		try {
			await GroupsService.leaveTheGroup(id);
			this.setIsChangeGroups(!this.isChangeGroups);
		} catch (e: any) {
			return { error: e.response?.data?.message };
		}
	};

	setIsChangeGroups = (isChangeGroups: boolean) => {
		this.isChangeGroups = isChangeGroups;
	};
}
