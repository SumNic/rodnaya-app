import { observer } from 'mobx-react-lite';
import { RULES_ROUTE } from '../../utils/consts';
import { Link } from 'react-router-dom';
import { useStoreContext } from '../../contexts/StoreContext';
import { Checkbox, Form, Typography } from 'antd';
import styles from './ConditionsForm.module.css';

const { Paragraph } = Typography;

const ConditionsForm: React.FC = () => {
	const { store } = useStoreContext();

	const handleFinish = () => {
		store.authStore.setRegistrationEnd(true);
	};

	return (
		<Form
			id="condition"
			layout="vertical"
			style={{ maxWidth: 600 }}
			onFinish={handleFinish}
			initialValues={{
				registr1: false,
				registr2: false,
				registr3: false,
				registr4: false,
			}}
		>
			<Paragraph className="personale_p">Подтвердите своё согласие с указанными утверждениями:</Paragraph>

			<Form.Item
				name="registr1"
				valuePropName="checked"
				rules={[{ required: true, message: 'Необходимо подтвердить согласие' }]}
			>
				<Checkbox>Я являюсь приверженцем идей, изложенных в серии книг Владимира Мегре Звенящие кедры России</Checkbox>
			</Form.Item>

			<Form.Item
				name="registr2"
				valuePropName="checked"
				rules={[{ required: true, message: 'Необходимо подтвердить согласие' }]}
			>
				<Checkbox>
					Я являюсь учредителем своей Родной партии. <br />
					Целью моей Родной партии является создание условий для возвращения в семьи энергии любви. <br />
					Моя Родная партия вернет народу образ жизни и обряды, способные навечно в семьях сохранять любовь. <br />
					Моя Родная партия Родину законом узаконит.
				</Checkbox>
			</Form.Item>

			<Form.Item
				name="registr3"
				valuePropName="checked"
				rules={[{ required: true, message: 'Необходимо подтвердить согласие' }]}
			>
				<Checkbox>
					Я согласен(на) с{' '}
					<Link to={RULES_ROUTE} className={styles.link}>
						правилами
					</Link>{' '}
					сайта Родная партия
				</Checkbox>
			</Form.Item>

			<Form.Item
				name="registr4"
				valuePropName="checked"
				rules={[{ required: true, message: 'Необходимо подтвердить согласие' }]}
			>
				<Checkbox>
					Я согласен(на), что информация о том, что я учредил свою Родную партию и декларация моей Родной партии, будут
					размещены в открытом доступе в интернете.
				</Checkbox>
			</Form.Item>
		</Form>
	);
};

export default observer(ConditionsForm);
