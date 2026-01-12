import { Button, Card, message, Space, Tag, Typography } from 'antd';
import { components } from '../../../utils/api';
import { useStoreContext } from '../../../contexts/StoreContext';
import { useViewedOnce } from '../../../hooks/useViewedOnce';
import dayjs from 'dayjs';
import { PERSONALE_ROUTE } from '../../../utils/consts';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

const VecheCard: React.FC<{ vech: components['schemas']['Zoom'] }> = ({ vech }) => {
	const { store } = useStoreContext();
	const { user } = store.authStore;

	const ref = useViewedOnce(() => {
		store.vechStore.markAsViewed(vech.id);
	});

	const getVechStatus = (startTime: string) => {
		const start = dayjs(startTime);
		const now = dayjs();

		if (now.isBefore(start)) return 'notStarted';
		if (now.isAfter(start.add(1, 'hour'))) return 'finished';

		return 'active';
	};

	const status = getVechStatus(vech.startTime);

	return (
		<div ref={ref}>
			<Card key={vech.id} hoverable style={{ marginBottom: 12 }} styles={{ body: { padding: '12px 16px' } }}>
				{/* HEADER */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 4,
						marginBottom: 8,
					}}
				>
					{/* Время + статус */}
					<Space size={6} wrap>
						<Tag color="blue">{dayjs(vech.startTime).format('DD.MM.YYYY HH:mm')} (МСК)</Tag>

						{status === 'active' && <Tag color="green">Идёт</Tag>}
						{status === 'notStarted' && <Tag color="blue">Скоро</Tag>}
					</Space>

					{/* Название */}
					<Typography.Text strong style={{ fontSize: 16, lineHeight: 1.3 }}>
						{vech.topic}
					</Typography.Text>
				</div>

				{/* BODY */}
				<Space direction="vertical" style={{ width: '100%' }} size={6}>
					{/* Описание */}
					{vech.description && (
						<Typography.Paragraph style={{ marginBottom: 4 }}>{vech.description}</Typography.Paragraph>
					)}

					{/* Автор */}
					<Typography.Text type="secondary" style={{ fontSize: 13 }}>
						Создатель:{' '}
						<Link to={PERSONALE_ROUTE + `/${vech.userId}`}>
							<b>{vech.fullName}</b>
						</Link>
					</Typography.Text>

					{/* Где проводится */}
					<Space size={4} wrap>
						{vech.groupId && (
							<Tag color="purple" style={{ margin: 0 }}>
								Группа: {user.userGroups.find((g) => g.id === vech.groupId)?.name}
							</Tag>
						)}
						{vech.locality && !vech.region && <Tag style={{ margin: 0 }}>{user.residency.locality}</Tag>}
						{vech.region && !vech.country && <Tag style={{ margin: 0 }}>{user.residency.region}</Tag>}
						{vech.country && <Tag style={{ margin: 0 }}>{user.residency.country}</Tag>}
						{!vech.country && !vech.region && !vech.locality && !vech.groupId && (
							<Tag color="gold" style={{ margin: 0 }}>
								Земля
							</Tag>
						)}
					</Space>

					{/* Кнопка подключения */}
					{vech.joinUrl && (
						<Button
							type="primary"
							disabled={status === 'finished'}
							onClick={() => {
								if (status === 'notStarted') {
									message.info(`Вече начнётся ${dayjs(vech.startTime).format('DD.MM.YYYY в HH:mm')} (МСК)`);
									return;
								}
								window.open(vech.joinUrl, '_blank');
							}}
						>
							{status === 'notStarted' ? 'Ещё не началось' : 'Подключиться к Вечу'}
						</Button>
					)}
				</Space>
			</Card>
		</div>
	);
};

export default observer(VecheCard);
