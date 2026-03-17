import { makeAutoObservable, observable } from 'mobx';
import MessagesService, {
	CreateLocationDto,
	CreateMessageDto,
	UpdateMessageDto,
	DeleteMessageDto,
} from '../services/MessagesService.ts';
import { CountNoReadMessages } from '../models/CountNoReadMessages.ts';
import { EndReadMessagesId } from '../models/EndReadMessagesId.ts';
import { Residency } from '../services/UserService.ts';
import { MessageWithPartialUser } from '../models/IMessages.ts';

export interface MessageCacheItem {
	posts: MessageWithPartialUser[];
	nextPage: number;
	prevPage: number;
	isLastMessage: boolean;
	updatedAt: number;
	scrollTop?: number;
	hasLoaded?: boolean;
	isSynced: boolean; // история синхронизирована
	hasUnreadGap: boolean; // есть непрочитанные, которые не загружены
	lastReadMessageId?: number; // id последнего прочитанного
}

type MessageCache = Record<string, MessageCacheItem>;

export default class MessageStore {
	arrCountNoReadMessages = observable.array<CountNoReadMessages>([]);
	arrLastReadMessagesId = observable.array<EndReadMessagesId>([]);
	cache: MessageCache = {};

	constructor() {
		makeAutoObservable(this);
	}

	async sendPostToChat(dto: CreateMessageDto) {
		try {
			const response = await MessagesService.sendMessage(dto);
			return { data: response.data };
		} catch (e: any) {
			return { error: e.response?.data?.message };
		}
	}

	async editMessage(dto: UpdateMessageDto) {
		try {
			const response = await MessagesService.editMessage(dto);
			return { data: response.data };
		} catch (e: any) {
			return { error: e.response?.data?.message };
		}
	}

	async deleteMessage(dto: DeleteMessageDto) {
		try {
			const response = await MessagesService.deleteMessage(dto);
			return { data: response.data };
		} catch (e: any) {
			return { error: e.response?.data?.message };
		}
	}

	updateArrCountNoReadMessages = (location: string, count: number) => {
		const existingEntry = this.arrCountNoReadMessages.find((item) => item.location === location);
		if (existingEntry) {
			existingEntry.count = count;
		} else {
			this.arrCountNoReadMessages.push({ location, count });
		}
	};

	updateArrLastReadMessagesId(location: string, id: number) {
		const existingEntry = this.arrLastReadMessagesId.find((item) => item.location === location);
		if (existingEntry) {
			existingEntry.id = id;
		} else {
			this.arrLastReadMessagesId.push({ location, id });
		}
	}

	get = (location: string): MessageCacheItem => {
		if (!this.cache[location]) {
			this.cache[location] = {
				posts: [],
				nextPage: 1,
				prevPage: -1,
				isLastMessage: false,
				hasLoaded: false,
				scrollTop: 0,
				updatedAt: Date.now(),
				isSynced: false,
				hasUnreadGap: false,
				lastReadMessageId: undefined,
			};
		}
		return this.cache[location];
	};

	set = (location: string, data: Partial<MessageCacheItem>) => {
		if (!location) return;
		this.cache[location] = {
			...this.get(location),
			...data,
			updatedAt: Date.now(),
		};
	};

	addMessages(location: string, messages: MessageWithPartialUser[]) {
		const item = this.get(location);
		const ids = new Set(item.posts.map((m) => m.id));
		const filtered = messages.filter((m) => !ids.has(m.id));

		item.posts = [...item.posts, ...filtered];
		item.updatedAt = Date.now();
	}

	prependMessages(location: string, messages: MessageWithPartialUser[]) {
		const item = this.get(location);
		const ids = new Set(item.posts.map((m) => m.id));
		const filtered = messages.filter((m) => !ids.has(m.id));

		item.posts = [...filtered, ...item.posts];
		item.updatedAt = Date.now();
	}

	clear(location: string) {
		delete this.cache[location];
	}

	getCountNoReadMessages = async (residencyUser: Residency) => {
		try {
			const { country, region, locality } = residencyUser;
			const residency: CreateLocationDto = { world: 'Земля', country, region, locality };

			const result = await MessagesService.getCountNoReadMessages({ residency });
			if (result.data) {
				result.data.forEach((elem) => {
					this.updateArrCountNoReadMessages(elem.location, elem.count);
				});
			}
		} catch (e: any) {
			console.log(`Ошибка в getCountNoReadMessages: ${e}`);
		}
	};

	getLastReadMessageId = async (residency: CreateLocationDto) => {
		try {
			const { country, region, locality } = residency;
			const residencyUser: CreateLocationDto = { world: 'Земля', country, region, locality };

			const result = await MessagesService.getLastReadMessageId(residencyUser);
			if (result.data) {
				result.data.forEach((elem) => {
					this.updateArrLastReadMessagesId(elem.location, elem.id);
				});
			}
		} catch (e: any) {
			console.log(`Ошибка в getLastReadMessageId: ${e}`);
		}
	};

	async updateEndReadMessagesIdInBackEnd(message_id: number, location: string) {
		try {
			await MessagesService.setEndReadMessagesId(message_id, location);
		} catch (error) {
			console.error(`Ошибка в updateEndReadMessagesIdInBackEnd: ${error}`);
		}
	}
}
