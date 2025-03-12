import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { LOCAL_STORAGE_END_READ_MESSAGE_ID, PERSONALE_ROUTE } from '../utils/consts';
import { useStoreContext } from '../contexts/StoreContext';
import { LocationUser } from '../models/LocationUser';
import { Button, message, Select, Typography } from 'antd';

const { Option } = Select;
const { Title } = Typography;

interface Props {
	id: number;
	secret: string;
}

const OnChangeForm: React.FC<Props> = ({ id, secret }) => {
	const navigate = useNavigate();

	const [country, setCountry] = useState<string>('');
	const [region, setRegion] = useState<string>('');
	const [locality, setLocality] = useState<string>('');
	const [messageBlock, setMessageBlock] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);

	const { store } = useStoreContext();

	const [click, setClick] = useState<boolean>(true);

	const [clickCount, setClickCount] = useState<boolean>(true);
	const [selectCount, setSelectCount] = useState<boolean>(false);

	function getCount() {
		if (click) {
			store.locationStore.getCountry();
			setClick(false);
		}
		return;
	}

	getCount();

	function selectCountry(e: string): void {
		setCountry(e);
		store.locationStore.getRegion(e);
		setSelectCount(true);
	}

	function selectRegion(e: string): void {
		setLocality('');
		store.locationStore.getRegion(country);
		setRegion(e);
		store.locationStore.getLocality(e);
	}

	function resetCountry() {
		if (selectCount) {
			setSelectCount(false);
		}

		setRegion('');
		if (clickCount && !selectCount) {
			setClickCount(false);
			return;
		}
		setClickCount(true);
	}

	const saveResidencyClickOk = async () => {
        if (!country || !region || !locality) return message.warning('Необходимо заполнить указанные поля!')

		setIsLoading(true);
		if (country && region && locality) {
			const dto = {
				id,
				country,
				region,
				locality,
				secret,
			};
			try {
				const response = await store.locationStore.saveResidency(dto);
				if (response.error) {
					var options: {} = {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
						timezone: 'UTC',
						hour: 'numeric',
						minute: 'numeric',
					};
					let dataStopEditResidency = new Date(+response.error).toLocaleString('ru', options);
					setMessageBlock(dataStopEditResidency);
				} else {
					localStorage.removeItem(LOCAL_STORAGE_END_READ_MESSAGE_ID);
					const userWithoutResidency = { ...store.authStore.user, residency: {} as LocationUser };
					store.authStore.setUser(userWithoutResidency);
					store.authStore.loginVk(dto.id, dto.secret).then(() => navigate(PERSONALE_ROUTE));
					store.authStore.setIsEditProfile(false); // закрывается окно редактирования в Personale_page
				}
				setIsLoading(false);
			} catch (error) {
				setIsLoading(false);
				message.warning('Не удалось сменить место жительсва! Повторите попытку позже.');
				console.error(`Ошибка в saveResidencyClickOk: ${error}`);
			}
		}
	};

	function cancel() {
		store.authStore.setRegistrationEnd(false);
		store.authStore.setIsEditProfile(false); // закрывается окно редактирования в Personale_page
	}

	return (
		<>
			<Title level={2} style={{ fontSize: '18px' }}>
				При сохранении или изменении адреса проживания, пожалуйста, обратите внимание: в случае неверного указания
				данных, возможность изменить адрес снова станет доступной только через один месяц.
			</Title>
			<div className="block_login_form">
				<Select
					id="country"
					placeholder="Укажите Вашу страну проживания"
					onChange={selectCountry}
					onClick={resetCountry}
					style={{ width: '100%', marginBottom: '10px' }}
				>
					{store.locationStore.country.map((item: any, index: any) => (
						<Option key={index} value={item.country}>
							{item.country}
						</Option>
					))}
				</Select>
				<Select
					id="region"
					placeholder="Укажите Ваш регион проживания"
					onChange={selectRegion}
					style={{ width: '100%', marginBottom: '10px' }}
					disabled={!country || !clickCount} // Дизаблим, если не выбрана страна
				>
					{country &&
						clickCount &&
						store.locationStore.region.map((item: any, index: any) => (
							<Option key={index} value={item.region}>
								{item.region}
							</Option>
						))}
				</Select>

				<Select
					id="locality"
					placeholder="Укажите Ваш район проживания"
					onChange={setLocality}
					style={{ width: '100%', marginBottom: '10px' }}
					disabled={!region} // Дизаблим, если не выбрана область
				>
					{region &&
						store.locationStore.locality.map((item: any, index: any) => (
							<Option key={index} value={item.locality}>
								{item.locality}
							</Option>
						))}
				</Select>

				{messageBlock && (
					<Title level={5} style={{ color: 'red' }}>
						Вы не можете сменить место жительства до {messageBlock}
					</Title>
				)}
				<div style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
					<Button onClick={cancel}>Отменить</Button>
					<Button type="primary" onClick={saveResidencyClickOk} loading={isLoading}>
						Сохранить
					</Button>
				</div>
			</div>
		</>
	);
};

export default observer(OnChangeForm);
