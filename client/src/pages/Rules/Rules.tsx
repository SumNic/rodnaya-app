import { useNavigate } from 'react-router-dom';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../../components/HeaderLogo/HeaderLogoRegistr';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import { observer } from 'mobx-react-lite';
import { REGISTRATION_ROUTE } from '../../utils/consts';
import { Button } from 'antd';
import React from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';
import styles from './Rules.module.css'; // используем тот же css, что и Home
import store from '../../store';

const Rules: React.FC = () => {
	const navigate = useNavigate();
	const { currentWidth } = useThemeContext();

	return (
		<div>
			<header className="header">
				<div className="header__wrapper">
					{currentWidth && currentWidth < 830 && <NavMiddle />}
					<HeaderLogoMobile />
					<HeaderLogoRegistr />
				</div>
			</header>

			<div className="middle">
				<div className="middle__wrapper">
					{currentWidth && currentWidth >= 830 && <NavMiddle />}

					<div className={styles.wrapper}>
						<section>
							<h1 className={styles['founders-title']} style={{ textAlign: 'center' }}>
								📜 Правила сайта Родной партии
							</h1>

							<div className={styles.wrapper_p}>
								<p className={styles['founders-description']} style={{ textAlign: 'center' }}>
									Главное правило:
								</p>
							</div>

							<div className={styles.wrapper_p}>
								<p className={styles['founders-description']}>
									<strong>1. Принимать созидательное участие в деятельности Родной партии.</strong>
								</p>
							</div>

							<div className={styles.wrapper_p}>
								<p className={styles['founders-description']} style={{ textAlign: 'center' }}>
									Исходя из этого, <span style={{ color: 'red' }}>запрещается</span>:
								</p>
							</div>

							<div className={styles.wrapper_p}>
								<ul className={styles['founders-description']}>
									<li>2. Оскорблять участников, автора ЗКР Владимира Мегре и любых людей.</li>
									<li>3. Разжигать расовую, межрелигиозную и межнациональную вражду.</li>
									<li>4. Распространять информацию, порочащую честь и достоинство людей.</li>
									<li>5. Распространять заведомо ложные сведения, наносящие вред.</li>
									<li>6. Использовать ненормативную лексику, проявлять агрессию.</li>
									<li>7. Многократно тиражировать одинаковые сообщения (спам).</li>
									<li>8. Пропагандировать учения, не входящие в рамки идей ЗКР.</li>
									<li>9. Передавать персональные данные (паспортные, банковские и др.).</li>
									<li>10. Любые нарушения, противоречащие первому пункту.</li>
								</ul>
							</div>

							<h2 className={styles['founders-subheading']}>📌 О модерации</h2>

							<div className={styles.wrapper_p}>
								<p className={styles['founders-description']}>
									11. Участники должны самостоятельно сообщать о нарушениях через кнопку
									<span style={{ color: 'red' }}> «нарушение правил»</span>.
								</p>
								<p className={styles['founders-description']}>12. Нельзя злоупотреблять функцией жалобы.</p>
							</div>

							<h2 className={styles['founders-subheading']}>⚖ Меры воздействия</h2>

							<div className={styles.wrapper_p}>
								<ul className={styles['founders-description']}>
									<li>1. Удаление нарушающего сообщения.</li>
									<li>2. Удаление всех сообщений систематического нарушителя.</li>
									<li>3. Блокировка участника на сутки, неделю, месяц, год или навсегда.</li>
									<li>4. Решение принимает модератор с учётом количества жалоб.</li>
								</ul>
							</div>

							<h2 className={styles['founders-subheading']}>ℹ Общая информация</h2>

							<div className={styles.wrapper_p}>
								<p className={styles['founders-description']}>
									Правила могут изменяться, дополняться и обновляться. Об изменениях будет сообщено заранее.
								</p>
							</div>

							<div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
								{!store.authStore.isRegistrationEnd && store.authStore.isCondition && !store.authStore.isDelProfile && (
									<Button
										type="primary"
										onClick={() => navigate(REGISTRATION_ROUTE)}
										style={{ padding: '20px', fontSize: '16px', marginBottom: '20px' }}
									>
										Продолжить регистрацию
									</Button>
								)}
							</div>
						</section>

						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default observer(Rules);
