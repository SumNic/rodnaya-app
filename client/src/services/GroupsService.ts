import { AxiosResponse } from 'axios';
import $api from '../api_http/index.ts';
import { CreateGroupDto } from '../models/CreateGroupDto.ts';
// import { IGroup } from '../models/response/IGroup.ts';
import { CountNoReadPostsGroups } from '../models/CountNoReadPostsGroups.ts';
import { EndReadPostsGroupsId } from '../models/EndReadPostsGroupsId.ts';
import { IPost } from '../models/IPost.ts';
import { components } from '../utils/api.ts';

export type CreatePostToChatDto = components['schemas']['CreatePostToChatDto'];
export type GroupMessage = components['schemas']['GroupMessage'];
export type Group = components['schemas']['Group'];

export default class GroupsService {
	static async createGroup(dto: CreateGroupDto): Promise<AxiosResponse<Group>> {
		return $api.post<Group>('/create-group', dto);
	}

	static async getAllGroups(location: string): Promise<AxiosResponse<Group[]>> {
		return $api.get<Group[]>('/get-all-group', {
			params: { location },
		});
	}

	static async getGroupFromId(id: number): Promise<AxiosResponse<Group>> {
		return $api.get<Group>(`/get-group/${id}`);
	}

	//TODO реализовать на бек-енде
	static async getCountNoReadPostsGroups(): Promise<AxiosResponse<CountNoReadPostsGroups[]>> {
		return $api.get<CountNoReadPostsGroups[]>('/get-count-no-read-posts-groups');
	}

	//TODO реализовать на бек-енде
	static async getLastReadPostsGroupsId(): Promise<AxiosResponse<EndReadPostsGroupsId[]>> {
		return $api.get<EndReadPostsGroupsId[]>('/get-last-read-posts-groups-id');
	}

	//TODO реализовать на бек-енде
	static async setLastReadPostsGroupsId(idGroup: number, idLastReadPost: number) {
		return $api.post('/set-last-read-posts-groups-id', {
			idGroup,
			idLastReadPost,
		});
	}

	static async getAllPosts(groupId: number, pageNumber: number): Promise<AxiosResponse<GroupMessage[]>> {
		return $api.get<GroupMessage[]>('/get-all-posts-group', {
			params: { groupId, pageNumber },
		});
	}

	static async sendPost(dto: CreatePostToChatDto): Promise<AxiosResponse<number>> {
		return $api.post<number>('/send-post-to-chat', dto);
	}

	static async joinTheGroup(id: number) {
		return $api.post('/join-the-group', { id });
	}

	static async leaveTheGroup(id: number) {
		return $api.post('/leave-the-group', { id });
	}

	static async blockedPostGroup(id_message: number, selectedActionIndex: number): Promise<AxiosResponse<string>> {
		return $api.post('/blocked-post-group', {
			id_message,
			selectedActionIndex,
		});
	}

	static async getPostGroupFromId(id_message: number): Promise<AxiosResponse<IPost>> {
		return $api.get<IPost>('/get-post-group-from-id', {
			params: { id_message },
		});
	}

	// static async getUserPublications(id: number, pageNumber: number): Promise<AxiosResponse<IPost[]>> {
	// 	return $api.get<IPost[]>('/get-user-publications', {
	// 		params: { id, pageNumber },
	// 	});
	// }
}
