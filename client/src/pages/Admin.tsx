import React, { useState, useEffect } from 'react';
import { Table, Modal, Radio, Button, message, Input } from 'antd';
import { ColumnsType } from 'antd/es/table';
import AdminService from '../services/AdminService';
import { IPost } from '../models/IPost';
import MessagesService from '../services/MessagesService';
import UserService from '../services/UserService';
import { GROUP, MESSAGES, PUBLICATIONS } from '../utils/consts';
import PublicationsService from '../services/PublicationsService';
import GroupsService from '../services/GroupsService';
import store from '../store';

interface FoulSendMessage {
	id: string; // Добавлен уникальный ключ
	id_foul_message: number;
	foul_message: IPost;
	id_cleaner_count: number;
	id_cleaners: number[];
	selectedRules: number[];
	selectedActionWithFoul: Record<number, number>;
	selectedPunishment: Record<number, number>;
	source: string;
}

const Admin: React.FC = () => {
	const [foulMessages, setFoulMessages] = useState<FoulSendMessage[]>([]);
	const [selectedFoulMessage, setSelectedFoulMessage] = useState<FoulSendMessage | null>(null);
	const [selectedActionWithFoul, setSelectedActionWithFoul] = useState<number | null>(null);
	const [selectedPunishment, setSelectedPunishment] = useState<number | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isChangeListFoulMessages, setIsChangeListFoulMessages] = useState(false);
	const [versionApp, setVersionApp] = useState('');

	const { commonStore } = store;

	useEffect(() => {
		store.authStore.checkAdmin();
		commonStore.getInfo();
		const fetchFoulMessages = async () => {
			try {
				const allFoulMessages = await AdminService.getFoulMessages();
				const groupedMessages: Record<number, FoulSendMessage> = {};
				allFoulMessages.data.forEach((message, index) => {
					if (groupedMessages[message.id_foul_message]) {
						groupedMessages[message.id_foul_message].id_cleaners.push(message.id_cleaner);

						groupedMessages[message.id_foul_message].selectedRules.push(...message.selectedRules);

						groupedMessages[message.id_foul_message].selectedActionWithFoul[message.selectedActionWithFoul] =
							(groupedMessages[message.id_foul_message].selectedActionWithFoul[message.selectedActionWithFoul] || 0) +
							1;

						groupedMessages[message.id_foul_message].selectedPunishment[message.selectedPunishment] =
							(groupedMessages[message.id_foul_message].selectedPunishment[message.selectedPunishment] || 0) + 1;
					} else {
						groupedMessages[message.id_foul_message] = {
							id: `message-${index}`, // Добавлен уникальный ключ
							id_foul_message: message.id_foul_message,
							foul_message: {} as IPost,
							id_cleaner_count: 1,
							id_cleaners: [message.id_cleaner],
							selectedRules: message.selectedRules,
							selectedActionWithFoul: { [message.selectedActionWithFoul]: 1 },
							selectedPunishment: { [message.selectedPunishment]: 1 },
							source: message.source,
						};
					}
				});
				const arrIdFoulMessages = Object.values(groupedMessages).map((message) => {
					return message;
				});
				const promises = arrIdFoulMessages.map(async (message) => {
					if (message.source === MESSAGES) {
						const dataPlus = await MessagesService.getMessageFromId(message.id_foul_message);
						return dataPlus.data;
					}
					if (message.source === PUBLICATIONS) {
						const dataPlus = await PublicationsService.getPublicationFromId(message.id_foul_message);
						return dataPlus.data;
					}
					if (message.source === GROUP) {
						const dataPlus = await GroupsService.getPostGroupFromId(message.id_foul_message);
						return dataPlus.data;
					}
				});

				const results = await Promise.all(promises);

				// Вычисляем количество уникальных id_cleaner для каждого id_foul_message
				const messages = Object.values(groupedMessages).map((message, index) => {
					return {
						...message,
						id_cleaner_count: new Set(message.id_cleaners).size,
						foul_message: results[index],
						source: message.source,
					} as FoulSendMessage;
				});

				setFoulMessages(messages);
			} catch (error) {
				console.error(` Ошибка в fetchFoulMessages: ${error}`);
			}
		};
		fetchFoulMessages();
	}, [isChangeListFoulMessages]);

	const handleEditFoulMessage = (record: FoulSendMessage) => {
		setSelectedFoulMessage(record);
		setSelectedActionWithFoul(null);
		setSelectedPunishment(null);
		setIsModalOpen(true);
	};

	const handleAddVersionApp = async () => {
		if (!versionApp.trim()) {
			return message.warning('Введите версию приложения');
		}

		try {
			await commonStore.addVersionMobileApp(versionApp.trim());
			message.success('Версия мобильного приложения добавлена');
			setVersionApp('');
		} catch (e) {
			message.error('Не удалось добавить версию приложения');
		}
	};

	const handleOk = async () => {
		try {
			const selectedActionIndex = actionOptions.indexOf(`${selectedActionWithFoul}`);
			const selectedPunishmentIndex = punishmentOptions.indexOf(`${selectedPunishment}`);
			if (selectedFoulMessage) {
				if (selectedActionIndex > 0) {
					if (selectedFoulMessage.source === MESSAGES) {
						const isDeletedMessages = await MessagesService.blockedMessages(
							selectedFoulMessage.foul_message.id,
							selectedActionIndex
						);
						if (!isDeletedMessages.data) return message.error('Произошла ошибка на сервере. Повторите попытку позже.');
						message.success(`${isDeletedMessages.data}`);
					}
					if (selectedFoulMessage.source === PUBLICATIONS) {
						const isDeletedMessages = await PublicationsService.blockedPublications(
							selectedFoulMessage.foul_message.id,
							selectedActionIndex
						);
						if (!isDeletedMessages.data) return message.error('Произошла ошибка на сервере. Повторите попытку позже.');
						message.success(`${isDeletedMessages.data}`);
					}
					if (selectedFoulMessage.source === GROUP) {
						const isDeletedMessages = await GroupsService.blockedPostGroup(
							selectedFoulMessage.foul_message.id,
							selectedActionIndex
						);
						if (!isDeletedMessages.data) return message.error('Произошла ошибка на сервере. Повторите попытку позже.');
						message.success(`${isDeletedMessages.data}`);
					}
				}
				if (selectedPunishmentIndex > 0) {
					const isBlockedUser = await UserService.blockedUser(
						selectedFoulMessage.foul_message.userId,
						selectedPunishmentIndex
					);
					if (!isBlockedUser.data) return message.error('Произошла ошибка на сервере. Повторите попытку позже.');
					message.success(`${isBlockedUser.data}`);
				}
				const isCleaningIsComplete = await AdminService.fetchCleaningIsComplete(
					selectedFoulMessage.foul_message.id,
					selectedFoulMessage.source
				);
				if (isCleaningIsComplete.data) setIsModalOpen(false);
				setIsChangeListFoulMessages((prev) => !prev);
			}
		} catch (err) {
			console.log(err, 'err');
		}

		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	const columns: ColumnsType<FoulSendMessage> = [
		{
			dataIndex: 'id_cleaner_count',
			title: 'Уборщик',
			render: (_, record) => <a onClick={() => alert(record.id_cleaners.join(', '))}>{record.id_cleaner_count}</a>,
		},
		{ dataIndex: 'id_foul_message', title: 'ID сообщения' },
		{ dataIndex: 'source', title: 'Источник' },
		{
			dataIndex: 'foul_message',
			title: 'Сообщение',
			render: (_, record) => (
				<div>
					<div key={record.foul_message.id}>{record.foul_message.message}</div>
				</div>
			),
		},
		{
			dataIndex: 'selectedRules',
			title: 'Нарушение правил',
			render: (_, record) => (
				<div>
					{[
						...record.selectedRules.reduce((acc, curr) => {
							acc.set(curr, (acc.get(curr) || 0) + 1);
							return acc;
						}, new Map<number, number>()),
					]
						.map(([key, value]) => ({
							[key]: value,
						}))
						.map((rule) => {
							for (const key in rule) {
								return (
									<div key={key}>
										Rule {key} : {rule[key]}
									</div>
								);
							}
						})}
				</div>
			),
		},
		{
			dataIndex: 'selectedActionWithFoul',
			title: 'Действие',
			render: (_, record) => (
				<div>
					{Object.entries(record.selectedActionWithFoul).map(([actionId, count]) => (
						<div key={actionId}>
							Action {actionId}: {count}
						</div>
					))}
				</div>
			),
		},
		{
			dataIndex: 'selectedPunishment',
			title: 'Наказание',
			render: (_, record) => (
				<div>
					{Object.entries(record.selectedPunishment).map(([punishmentId, count]) => (
						<div key={punishmentId}>
							Punishment {punishmentId}: {count}
						</div>
					))}
				</div>
			),
		},
		{
			dataIndex: 'edit',
			title: 'Решить',
			render: (_, record) => <Button onClick={() => handleEditFoulMessage(record)}>Edit</Button>,
		},
	];

	const actionOptions = ['Do not delete', 'Delete this message', 'Delete all user messages'];
	const punishmentOptions = [
		'No block',
		'Block 1 day',
		'Block 1 week',
		'Block 1 month',
		'Block 1 year',
		'Block forever',
	];

	return store.authStore.isAdmin ? (
		<>
			<div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
				<div>
					<strong>Текущая версия мобильного приложения: </strong>
					{commonStore.commonInfo?.version || 'нет данных'}
				</div>

				<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
					<Input
						placeholder="Версия мобильного приложения (например, 1.0.0)"
						value={versionApp}
						onChange={(e) => setVersionApp(e.target.value)}
						style={{ maxWidth: 300 }}
					/>
					<Button type="primary" onClick={handleAddVersionApp}>
						Добавить версию приложения
					</Button>
				</div>
			</div>

			<Table dataSource={foulMessages} columns={columns} rowKey="id" />
			<Modal title="Edit Foul Message" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
				<h3>Message Actions</h3>
				<Radio.Group
					options={actionOptions}
					value={selectedActionWithFoul !== null ? selectedActionWithFoul : undefined}
					onChange={(e) => setSelectedActionWithFoul(e.target.value)}
					optionType="button"
					buttonStyle="solid"
				/>
				<h3>Punishment</h3>
				<Radio.Group
					options={punishmentOptions}
					value={selectedPunishment !== null ? selectedPunishment : undefined}
					onChange={(e) => setSelectedPunishment(e.target.value)}
					optionType="button"
					buttonStyle="solid"
				/>
			</Modal>
		</>
	) : (
		''
	);
};

export default Admin;
