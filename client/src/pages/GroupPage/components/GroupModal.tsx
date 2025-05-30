import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useStoreContext } from '../../../contexts/StoreContext';
import { IGroup } from '../../../models/response/IGroup';

const { TextArea } = Input;

interface GroupModalProps {
    visible: boolean;
    location: string | undefined;
    onCancel: () => void;
    onCreate: (group: IGroup) => void;
}

const GroupModal: React.FC<GroupModalProps> = ({ visible, location, onCancel, onCreate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { store } = useStoreContext();
    const {createGroup} = store.groupStore;
    
	const [form] = Form.useForm();

	const handleCreate = async () => {
		try {
            setIsLoading(true)
			const values = await form.validateFields();

			const group = await createGroup({...values, location});

			form.resetFields(); // Очистка формы

			if (group.error) {
				return message.error(group.error);
			}

			if (group.data) onCreate(group.data);
		} catch (error) {
			message.error('Пожалуйста, заполните все поля корректно.');
		} finally {
            setIsLoading(false)
            onCancel()
        }
	};

	return (
		<Modal
			open={visible}
			title="Создать группу"
			onCancel={onCancel}
            loading={isLoading}
			footer={[
				<Button key="cancel" onClick={onCancel}>
					Отмена
				</Button>,
				<Button key="create" type="primary" onClick={handleCreate}>
					Создать
				</Button>,
			]}
		>
			<Form form={form} layout="vertical">
				<Form.Item
					label="Название группы"
					name="groupName"
					rules={[
						{ required: true, message: 'Пожалуйста, введите название группы!' },
						{ max: 48, message: 'Название группы не должно превышать 30 символов!' },
					]}
				>
					<Input placeholder="Введите название" maxLength={30} />
				</Form.Item>

				<Form.Item
					label="Задача группы"
					name="groupTask"
					rules={[
						{ required: true, message: 'Пожалуйста, введите задачу группы!' },
						{ max: 300, message: 'Задача группы не должна превышать 300 символов!' },
					]}
				>
					<TextArea placeholder="Введите задачу" maxLength={300} rows={4} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default GroupModal;
