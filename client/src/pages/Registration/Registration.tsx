// import { Context } from '..';
import ConditionsForm from '../../components/ConditionsForm/ConditionsForm';
import HeaderLogoRegistr from '../../components/HeaderLogo/HeaderLogoRegistr';
import OnChangeForm from '../../components/OnChangeForm';
import { observer } from 'mobx-react-lite';
import MyButtonInput from '../../components/MyButtonInput';
import { useStoreContext } from '../../contexts/StoreContext';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import styles from './Registration.module.css';
import { useThemeContext } from '../../contexts/ThemeContext';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import { PERSONALE_ROUTE } from '../../utils/consts';

function Registration() {
	// const {store} = useContext(Context)
	const { store } = useStoreContext();

	const { currentWidth } = useThemeContext();

	return (
		<div>
			<header className="header">
				<div className="header__wrapper">
					{currentWidth && currentWidth < 830 && <NavMiddle item={PERSONALE_ROUTE} />}
					<HeaderLogoMobile />
					<HeaderLogoRegistr />
				</div>
			</header>

			<div className="middle">
				<div className="middle__wrapper">
					{currentWidth && currentWidth >= 830 && <NavMiddle item={PERSONALE_ROUTE} />}
					<div className={`main__screen main__screen_home  ${styles.wrapper}`}>
						<div className="form__registr" style={{ textAlign: 'justify' }}>
							{!store.authStore.isRegistrationEnd && store.authStore.isCondition && !store.authStore.isDelProfile && (
								<>
									<ConditionsForm />
									<MyButtonInput type="submit" form="condition" id="submit" value="Продолжить регистрацию" />
								</>
							)}

							{!store.authStore.user.residency && store.authStore.isRegistrationEnd && (
								<OnChangeForm id={store.authStore.user.id} secret={store.authStore.user.secret} />
							)}
						</div>
					</div>
				</div>
			</div>

			{/* <Footer /> */}
		</div>
	);
}

export default observer(Registration);
