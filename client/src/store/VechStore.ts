import { makeAutoObservable, runInAction } from 'mobx';
import { components } from '../utils/api';
import { VechService } from '../services/VechService';
import { Socket } from 'socket.io-client';

export default class VechStoreClass {
	meetings: components['schemas']['ZoomWithUnreadDto'][] = [];
	isLoadingVeche: boolean = false;

	constructor() {
		makeAutoObservable(this);
	}

	bindSocket(socket: Socket) {
		socket.on('newVech', (vech) => {
			this.addMeeting({
				...vech,
				isUnread: true,
			});
		});
	}

	addMeeting = (vech: components['schemas']['ZoomWithUnreadDto']) => {
		this.meetings.unshift(vech);
	};

	createVech = async (data: components['schemas']['CreateMeetingDto']) => {
		try {
			const response = await VechService.createVech(data);
			return { data: response.data };
		} catch (err: any) {
			console.log(`Ошибка в createVech: ${err}`);
			return { error: err.response?.data?.message };
		}
	};

	getVeches = async () => {
		try {
			const response = await VechService.getVeches();

			runInAction(() => {
				this.meetings = response.data.map((vech) => ({
					...vech,
					isUnread: vech.isUnread,
				}));
			});

			return { data: response.data };
		} catch (err: any) {
			console.log(`Ошибка в getVeches: ${err}`);
			return { error: err.response?.data?.message };
		}
	};

	get unreadCount() {
		return this.meetings.filter((m) => m.isUnread).length;
	}

	async markAsViewed(id: number) {
		const vech = this.meetings.find((m) => m.id === id);
		if (!vech || !vech.isUnread) return;

		vech.isUnread = false;

		await VechService.markViewed(id);
	}
}
