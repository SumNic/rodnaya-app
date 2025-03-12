import { observer } from 'mobx-react-lite';
import { useStoreContext } from '../contexts/StoreContext';
import { Button, Form, Input, message, Typography } from 'antd';
import { useState } from 'react';

const { TextArea } = Input;
const { Title } = Typography;

interface FormValues {
	id?: number; // или number, в зависимости от вашего API
	secret?: string;
	declaration: string; // Предполагается, что это поле обязательно
}

function Declaration() {
	const [isLoading, setIsLoading] = useState(false);

	const { store } = useStoreContext();

	const handleSubmit = async (values: FormValues) => {
		try {
			setIsLoading(true);
			// Вызываем метод для добавления декларации
			await store.authStore.addDeclaration(values);

			store.authStore.setIsEditProfile(false); // Закрывается окно редактирования в Personale_page
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			message.warning('Не удалось сохранить Декларацию!');
			console.error(`Ошибка в Declaration: ${error}`);
		}
		// values содержит всю необходимую информацию из формы
	};

	const cancel = () => {
		store.authStore.setIsEditProfile(false); // Закрывается окно редактирования в Personale_page
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
		if (e.key === 'Tab') {
			e.preventDefault();

			// Приводим e.target к HTMLTextAreaElement
			const textArea = e.target as HTMLTextAreaElement;

			// Проверяем, что textArea действительно является элементом текстовой области
			if (textArea) {
				textArea.setRangeText('\t', textArea.selectionStart, textArea.selectionEnd, 'end'); // Вставляем табуляцию
			}
		}
	};

	return (
		<Form
			method="post"
			onFinish={handleSubmit}
			initialValues={{
				id: store.authStore.user.id,
				secret: store.authStore.user.secret,
				declaration: store.authStore.user.declaration?.declaration || '',
			}}
		>
			<Title level={2} style={{ textAlign: 'center', fontSize: '20px' }}>
				Декларация <br />
				моей Родной партии:
			</Title>

			<Form.Item name="id" style={{ display: 'none' }}>
				<Input type="hidden" />
			</Form.Item>

			<Form.Item name="secret" style={{ display: 'none' }}>
				<Input type="hidden" />
			</Form.Item>

			<Form.Item name="declaration">
				<TextArea id="text1" style={{ fontSize: '14px' }} rows={20} onKeyDown={handleKeyDown} />
			</Form.Item>

			<div style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
				<Form.Item>
					<Button type="default" onClick={cancel}>
						Отменить
					</Button>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={isLoading}>
						Сохранить
					</Button>
				</Form.Item>
			</div>
		</Form>
	);
}

export default observer(Declaration);
