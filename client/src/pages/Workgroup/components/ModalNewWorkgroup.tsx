import { Button, Modal, Typography } from "antd";
import { useStore } from "../../../hooks/useStore.hook";

const { Title, Text } = Typography;

function ModalNewWorkgroup() {

	const {store} = useStore();

    const { isModalNewWorkgroupOpen, setIsModalNewWorkgroupOpen } = store.groupStore;

	const handleCancel = () => {
		setIsModalNewWorkgroupOpen(false);
	};

    return (
        <Modal
			open={isModalNewWorkgroupOpen}
			onCancel={handleCancel}
			centered
			width={400}
			footer={[
				<Button
					// icon={<GoogleIcon height="20px" />}
					size="large"
					// className={styles['login-btn']}
					// onClick={() => (window.location.href = 'https://molt.boats/api/oauth/providers/google')}
					key="link"
					href={''}
				>
					Продолжить с Google
				</Button>,
			]}
		>
			
				<Title level={3} style={{ marginBottom: 0 }}>
					Войти
				</Title>

				<Text>В MOL'T Boats аккаунт, чтобы зарегистрировать Ваш Гидробот</Text>
		</Modal>
    )

}

export default ModalNewWorkgroup;