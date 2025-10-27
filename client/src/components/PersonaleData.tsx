import { observer } from 'mobx-react-lite';
import { useStoreContext } from '../contexts/StoreContext';
import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';

const PersonaleData: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false);

	const { store } = useStoreContext();

	const handleSubmit = async (values: any) => {
		try {
			setIsLoading(true);
			// Обновляем данные пользователя
			await store.authStore.updatePersonaleData(store.authStore.user.secret, values);
			setIsLoading(false);
			store.authStore.setIsEditProfile(false); // Закрываем окно редактирования в Personale_page
		} catch (error) {
			setIsLoading(false);
			message.warning('Не удалось сохранить персональные данные');
		}
	};

	const cancel = () => {
		store.authStore.setRegistrationEnd(false);
		store.authStore.setIsEditProfile(false); // Закрываем окно редактирования в Personale_page
	};

	return (
		<Form
			name="basic"
			labelCol={{
				span: 10,
			}}
			style={{
				maxWidth: 600,
			}}
			onFinish={handleSubmit}
			initialValues={{
				user_id: store.authStore.user.id,
				first_name: store.authStore.user.first_name,
				last_name: store.authStore.user.last_name,
			}}
		>
			<Form.Item name="user_id" style={{ display: 'none' }}>
				<Input type="hidden" />
			</Form.Item>

			<Form.Item
				name="first_name"
				label="Укажите ваше имя"
				style={{ marginTop: '30px' }}
				rules={[{ required: true, message: 'Пожалуйста, введите ваше имя!' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				name="last_name"
				label="Укажите вашу фамилию"
				rules={[{ required: true, message: 'Пожалуйста, введите вашу фамилию!' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item>
				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
					<Button onClick={cancel}>Отменить</Button>
					<Button type="primary" htmlType="submit" loading={isLoading}>
						Сохранить
					</Button>
				</div>
			</Form.Item>
		</Form>
	);
};

export default observer(PersonaleData);
