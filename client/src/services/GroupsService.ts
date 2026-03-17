import { AxiosResponse } from 'axios';
import $api from '../api_http/index.ts';
import { CreateGroupDto } from '../models/CreateGroupDto.ts';
import { EndReadPostsGroupsId } from '../models/EndReadPostsGroupsId.ts';
import { IPost } from '../models/IPost.ts';
import { components } from '../utils/api.ts';

export type CreatePostToChatDto = components['schemas']['CreatePostToChatDto'];
export type GroupMessage = components['schemas']['GroupMessage'];
export type Group = components['schemas']['Group'];
export type UpdateGroupMessageDto = components['schemas']['UpdateGroupMessageDto'];
export type DeleteGroupMessageDto = components['schemas']['DeleteGroupMessageDto'];
export type GroupUnreadInfoDto = components['schemas']['GroupUnreadInfoDto'];
export type GetPostsGroupDto = components['schemas']['GetPostsGroupDto'];

export default class GroupsService {
	static async createGroup(dto: CreateGroupDto): Promise<AxiosResponse<Group>> {
		return $api.post<Group>('/groups/create-group', dto);
	}

	static async getAllGroups(location: string): Promise<AxiosResponse<Group[]>> {
		return $api.get<Group[]>('/groups/get-all-group', {
			params: { location },
		});
	}

	static async getGroupFromId(id: number): Promise<AxiosResponse<Group>> {
		return $api.get<Group>(`/groups/get-group/${id}`);
	}

	//TODO реализовать на бек-енде
	// static async getCountNoReadPostsGroups(): Promise<AxiosResponse<CountNoReadPostsGroups[]>> {
	// 	return $api.get<CountNoReadPostsGroups[]>('/groups/get-count-no-read-posts-groups');
	// }

	static async getLastReadPostsGroupsId(): Promise<AxiosResponse<EndReadPostsGroupsId[]>> {
		return $api.get<EndReadPostsGroupsId[]>('/groups/last-read');
	}

	static async setLastReadPostsGroupsId(groupId: number, lastReadPostId: number) {
		return $api.post('/groups/last-read', {
			groupId,
			lastReadPostId,
		});
	}

	static async getUserGroupsUnreadInfo(): Promise<AxiosResponse<GroupUnreadInfoDto[]>> {
		return $api.get<GroupUnreadInfoDto[]>('/groups/unread-info');
	}

	static async getAllPosts(dto: GetPostsGroupDto): Promise<AxiosResponse<GroupMessage[]>> {
		return $api.post<GroupMessage[]>('/groups/get-all-posts-group', dto);
	}

	static async sendPost(dto: CreatePostToChatDto): Promise<AxiosResponse<number>> {
		return $api.post<number>('/groups/post-group', dto);
	}

	static async editMessage(dto: UpdateGroupMessageDto): Promise<AxiosResponse<string>> {
		return $api.patch<string>('/groups/post-group', dto);
	}

	static async deleteMessage(dto: DeleteGroupMessageDto): Promise<AxiosResponse<string>> {
		return $api.delete<string>('/groups/post-group', { data: dto });
	}

	static async getPostGroupFromId(id_message: number): Promise<AxiosResponse<IPost>> {
		return $api.get<IPost>('/groups/post-group', {
			params: { id_message },
		});
	}

	static async joinTheGroup(id: number) {
		return $api.post('/groups/join-the-group', { id });
	}

	static async leaveTheGroup(id: number) {
		return $api.post('/groups/leave-the-group', { id });
	}

	static async blockedPostGroup(id_message: number, selectedActionIndex: number): Promise<AxiosResponse<string>> {
		return $api.post('/groups/blocked-post-group', {
			id_message,
			selectedActionIndex,
		});
	}
}
