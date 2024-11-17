import React, { useState } from 'react';
import Footer from '../components/Footer';
import HeaderLogoMobile from '../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import { useStoreContext } from '../contexts/StoreContext';
import { EXIT_ROUTE, PERSONALE_ROUTE } from '../utils/consts';
import { Button, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useNavigate } from 'react-router-dom';

const Exit: React.FC = () => {
	const [checked, setChecked] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

	const { store } = useStoreContext();

    const navigate = useNavigate();

	const handleChange = (e: CheckboxChangeEvent) => {
		setChecked(e.target.checked);
	};

	const logout = async () => {
		try {
            setIsLoading(true)
            await store.logout(checked);
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error, 'error');
        }
	};

    const cancelExit = () => {
        navigate(PERSONALE_ROUTE);
    };

	return (
		<div>
			<header className="header">
				<div className="header__wrapper">
					<HeaderLogoMobile />
					<HeaderLogoRegistr />
				</div>
			</header>

			<div className="middle">
				<div className="middle__wrapper">
					<NavMiddle item={EXIT_ROUTE} />
					<div className="main__screen main__screen_home">
						<div id="list_founders" style={{marginTop: '50px'}}>
							<Checkbox checked={checked} onChange={handleChange} id="exit">
								<span style={{ fontSize: '20px', padding: '10px' }}>Выйти со всех устройств?</span>
							</Checkbox>
                            <div style={{display: 'flex', justifyContent: 'left', gap: '10px', marginTop: '10px'}}>
                                <Button onClick={cancelExit}>Отменить</Button>
                                <Button type="primary" onClick={logout} loading={isLoading}>
                                    Выйти 
                                </Button>
                            </div>
						</div>

						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default Exit;
