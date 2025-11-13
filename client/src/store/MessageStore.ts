import { makeAutoObservable, observable } from 'mobx';
import MessagesService, {
	CreateLocationDto,
	CreateMessageDto,
	UpdateMessageDto,
	DeleteMessageDto,
} from '../services/MessagesService.ts';
import { LocationUser } from '../models/LocationUser.ts';
import { CountNoReadMessages } from '../models/CountNoReadMessages.ts';
import { EndReadMessagesId } from '../models/EndReadMessagesId.ts';

export default class MessageStore {
	arrCountNoReadMessages = observable.array<CountNoReadMessages>([]);
	arrLastReadMessagesId = observable.array<EndReadMessagesId>([]);

	constructor() {
		makeAutoObservable(this);
	}

	async sendMessage(dto: CreateMessageDto) {
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

	getCountNoReadMessages = async (id: number, secret: string, residency: CreateLocationDto) => {
		try {
			const { country, region, locality } = residency;
			const residencyUser: CreateLocationDto = { world: 'Земля', country, region, locality };

			const dto = {
				id: id.toString(),
				secret,
				residency: residencyUser,
			};

			const result = await MessagesService.getCountNoReadMessages(dto);
			if (result.data) {
				result.data.forEach((elem) => {
					this.updateArrCountNoReadMessages(elem.location, elem.count);
				});
			}
		} catch (e: any) {
			console.log(`Ошибка в getCountNoReadMessages: ${e}`);
		}
	};

	getLastReadMessageId = async (id: number, secret: string, residency: LocationUser) => {
		try {
			const { country, region, locality } = residency;
			const residencyUser: LocationUser = { world: 'Земля', country, region, locality };

			const dto = {
				id,
				secret,
				residency: residencyUser,
			};

			const result = await MessagesService.getLastReadMessageId(dto);
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
