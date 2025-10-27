import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStoreContext } from '../contexts/StoreContext';
import { Button, Select } from 'antd';

const { Option } = Select;

interface Props {
	onClick: () => void;
	onCancel: () => void;
}

const Residency: React.FC<Props> = ({ onClick, onCancel }) => {
	const [country, setCountry] = useState<string>('');
	const [region, setRegion] = useState<string>('');
	const [locality, setLocality] = useState<string>('');

	const { store } = useStoreContext();
	const { setSelectCountry, setSelectRegion, setSelectLocality } = store.locationStore;

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

	const handleResidencyClickOk = async () => {
		if (country) setSelectCountry(country);
		if (region) setSelectRegion(region);
		if (locality) setSelectLocality(locality);
		onClick();
	};

	function handleResidencyClickCancel() {
		setSelectCountry('');
		setSelectRegion('');
		setSelectLocality('');
		onCancel();
	}

	return (
		<>
			<div className="block_login_form">
				<Select
					id="country"
					placeholder="Укажите страну"
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
					placeholder="Укажите регион"
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
					placeholder="Укажите район"
					onChange={setLocality}
					style={{ width: '100%', marginBottom: '10px' }}
					disabled={!region}
				>
					{region &&
						store.locationStore.locality.map((item: any, index: any) => (
							<Option key={index} value={item.locality}>
								{item.locality}
							</Option>
						))}
				</Select>

				<div style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
					<Button onClick={handleResidencyClickCancel}>Отменить</Button>
					<Button type="primary" onClick={handleResidencyClickOk}>
						Выбрать
					</Button>
				</div>
			</div>
		</>
	);
};

export default observer(Residency);
