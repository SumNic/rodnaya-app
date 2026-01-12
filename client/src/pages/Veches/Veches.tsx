import React, { useEffect, useState } from 'react';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../../components/HeaderLogo/HeaderLogoRegistr';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import { VECHE_ROUTE } from '../../utils/consts';
import { useStoreContext } from '../../contexts/StoreContext';
import { Button, DatePicker, Form, Input, List, message, Modal, Radio, Select } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useThemeContext } from '../../contexts/ThemeContext';

import styles from './Veches.module.css';
import { observer } from 'mobx-react-lite';
import { Publication, User } from '../../services/PublicationsService';
import dayjs from 'dayjs';
import VecheCard from './components/VecheCard';
import { useSocketContext } from '../../contexts/SocketContext';

interface VechesProps {}

const { Option } = Select;

export type PublicationWithPartialUser = Omit<Publication, 'user'> & {
	user: Partial<User>;
} & {
	location: string;
} & { createdAt?: string };
const Veches: React.FC<VechesProps> = () => {
	// const [isUpcomingVeches, setIsUpcomingVeches] = useState(true);
	const [open, setOpen] = useState(false);
	const [targetType, setTargetType] = useState<'chats' | 'groups'>('chats');
	// const [veches, setVeches] = useState<components['schemas']['Zoom'][]>();
	const [loading, setLoading] = useState(false);

	const [form] = Form.useForm();

	const { store } = useStoreContext();
	const { createVech, getVeches, meetings } = store.vechStore;
	const { user } = store.authStore;

	const { currentWidth } = useThemeContext();
	const { socket } = useSocketContext();
	useEffect(() => {
		handleGetVeches();
	}, []);

	const handleGetVeches = async () => {
		const veches = await getVeches();

		// if (veches.data) return setVeches(veches.data);
		if (veches.error) message.error(veches.error);
	};

	const handleCreate = async () => {
		try {
			setLoading(true);
			const values = await form.validateFields();

			const newVeche = await createVech({
				topic: values.topic,
				description: values.description,
				startTime: values.startTime.toISOString(),
				location: values.location,
				groupId: values.groupId,
			});

			socket?.emit('newVech', {
				...newVeche.data,
				groupId: values.groupId,
				location: values.location,
			});

			if (newVeche.error) message.error(newVeche.error);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false); // 🔥 выключаем спиннер
			setOpen(false);
			form.resetFields();
		}
	};

	const now = dayjs();

	const visibleVeches = meetings?.filter((vech) => {
		const start = dayjs(vech.startTime);
		const end = start.add(1, 'hour');

		return now.isBefore(end);
	});

	return (
		<>
			<div>
				<header className="header">
					<div className="header__wrapper">
						{currentWidth && currentWidth < 830 && <NavMiddle item={VECHE_ROUTE} />}
						<HeaderLogoMobile />
						<HeaderLogoRegistr />
					</div>
				</header>

				<div className="middle">
					<div className="middle__wrapper">
						{currentWidth && currentWidth >= 830 && <NavMiddle item={VECHE_ROUTE} />}
						<div className="main__screen main__screen_home">
							<div id="list_founders">
								<div className={styles.buttonsPublications}>
									{store.authStore.isAuth && (
										<Button
											type="primary"
											onClick={() => setOpen(true)}
											style={{ width: '100%', marginTop: 8 }}
											icon={<BellOutlined />}
										>
											Созвать Вече
										</Button>
									)}

									{/* <Button onClick={() => setIsUpcomingVeches((prev) => !prev)} style={{ width: '100%', marginTop: 8 }}>
										{isUpcomingVeches ? 'Предстоящие' : 'Прошедшие'}
									</Button> */}
								</div>
								<div className={styles.vechesList}>
									<List
										dataSource={visibleVeches}
										itemLayout="vertical"
										size="large"
										renderItem={(vech) => <VecheCard key={vech.id} vech={vech} />}
									/>
								</div>
							</div>

							<div className="main__screen-flag"></div>
						</div>
					</div>
				</div>
			</div>
			<Modal
				title="Созвать Вече"
				open={open}
				onCancel={() => setOpen(false)}
				onOk={handleCreate}
				okText="Создать"
				cancelText="Отменить"
				okButtonProps={{ loading }}
			>
				<Form
					form={form}
					layout="vertical"
					initialValues={{
						targetType: 'chats',
					}}
				>
					{/* Тема */}
					<Form.Item label="Тема Веча" name="topic" rules={[{ required: true, message: 'Введите тему' }]}>
						<Input />
					</Form.Item>

					{/* Описание */}
					<Form.Item label="Описание" name="description">
						<Input.TextArea rows={3} maxLength={255} showCount />
					</Form.Item>

					{/* Дата */}
					<Form.Item
						label="Дата и время (московское)"
						name="startTime"
						rules={[{ required: true, message: 'Выберите дату и время' }]}
					>
						<DatePicker
							showTime
							format="DD.MM.YYYY HH:mm"
							disabledDate={(current) => {
								return current && current.startOf('day').isBefore(dayjs().startOf('day'));
							}}
							disabledTime={(current) => {
								if (!current) return {};

								const now = dayjs();

								// если выбран не сегодня — ничего не блокируем
								if (!current.isSame(now, 'day')) {
									return {};
								}

								return {
									disabledHours: () => Array.from({ length: now.hour() }, (_, i) => i),

									disabledMinutes: (selectedHour) =>
										selectedHour === now.hour() ? Array.from({ length: now.minute() }, (_, i) => i) : [],
								};
							}}
							style={{ width: '100%' }}
						/>
					</Form.Item>

					{/* Тип назначения */}
					<Form.Item label="Где созвать Вече" name="targetType">
						<Radio.Group value={targetType} onChange={(e) => setTargetType(e.target.value)}>
							<Radio value="chats">Чаты</Radio>
							<Radio value="groups">Группы</Radio>
						</Radio.Group>
					</Form.Item>

					{/* Если Чаты */}
					{targetType === 'chats' && (
						<Form.Item label="Уровень чата" name="location" rules={[{ required: true, message: 'Выберите уровень' }]}>
							<Select placeholder="Выберите уровень">
								<Option value="world">Мир</Option>
								<Option value="country">Страна</Option>
								<Option value="region">Регион</Option>
								<Option value="locality">Район</Option>
							</Select>
						</Form.Item>
					)}

					{/* Если Группы */}
					{targetType === 'groups' && (
						<Form.Item label="Группа" name="groupId" rules={[{ required: true, message: 'Выберите группу' }]}>
							<Select placeholder="Выберите группу">
								{user?.userGroups?.map((group) => {
									return (
										<Option key={group.id} value={group.id}>
											{group.name}
										</Option>
									);
								})}
							</Select>
						</Form.Item>
					)}
				</Form>
			</Modal>
		</>
	);
};

export default observer(Veches);
