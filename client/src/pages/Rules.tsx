import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import HeaderLogoMobile from '../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import { observer } from 'mobx-react-lite';
import { REGISTRATION_ROUTE } from '../utils/consts';
import { Button } from 'antd';
import React from 'react';
import { useThemeContext } from '../contexts/ThemeContext';

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
					{currentWidth && currentWidth < 830 && <NavMiddle />}
					<div className="main__screen main__screen_home">
						<div className="form__registr">
							<div className="rules">
								<h2 style={{ textAlign: 'center' }}>Правила сайта.</h2>
								<h3 className="personale_h3">Главное правило: </h3>
								<p>1. Принимать созидательное участие в деятельности Родной партии.</p>
								<br />
								<p className="personale_p" style={{ textAlign: 'center' }}>
									Исходя из этого правила, <span style={{ color: 'red' }}>запрещается</span>:{' '}
								</p>

								<p>
									2. Любые оскорбления других участников сайта, а также автора книг серии Звенящие кедры России (далее
									ЗКР) Владимира Мегре, главных героев этих книг, ну и вообще любых людей.
								</p>
								<p>3. Разжигать рассовую, межрелигиозную, межнациональную и другую вражду.</p>
								<p>4. Распространять информацию, порочащую честь и достоинство других людей.</p>
								<p>5. Распространять заведомо ложную информацию, которая может причинить вред другим людям.</p>
								<p>6. Использовать ненормативную лексику, вести себя грубо, агрессивно.</p>
								<p>7. Многократно тиражировать одни и теже сообщения.</p>
								<p>8. Пропагандировать и распростанять учения и движения, не входящие в рамки идей ЗКР.</p>
								<p>9. Передавать с помощью сайта личные данные (паспортные данные, банковские данные и др.).</p>
								<p>10. Любые другие нарушения, не попавшие в этот список, но противоречащие первому пункту.</p>
								<br />

								<p className="personale_p" style={{ textAlign: 'center' }}>
									Модератор не следит за соблюдением правил во всех беседах, поэтому:
								</p>
								<p>
									11. Участники форума <span style={{ color: 'red' }}>должны</span> самостоятельно сообщать о нарушении
									правил другими участниками с помощью кнопки <span style={{ color: 'red' }}>нарушение правил</span>,
									размещенной справа от каждого сообщения. Чем больше человек сообщит о нарушении правил каким-то
									участником, тем проще модератору будет принять решение, относительно этого нарушения.
								</p>
								<p>
									12. В тоже время, нельзя такой возможностью злоупотреблять и указывать о нарушении правил, когда
									правила не нарушены.
								</p>
								<br />

								<p className="personale_p" style={{ textAlign: 'center' }}>
									В случае нарушения указанных правил, могут применяться следующие формы модерации:
								</p>
								<p>1. Удаление сообщения, нарушающего правила сайта.</p>
								<p>2. Удаление всех сообщений участника, систематически нарушающего правила сайта.</p>
								<p>3. Блокировка участника, нарушающего правила сайта, на сутки, неделю, месяц, год, навсегда.</p>
								<p>
									4. Решение о принимаемой мере воздействия принимается модератором самостоятельно, с учетом поступивших
									сообщений о нарушении.
								</p>
								<br />

								<p className="personale_p" style={{ textAlign: 'center' }}>
									Общая информация:
								</p>
								<p>
									Правила сайта могут изменяться, добавляться, удаляться. О всех изменениях правил будет сообщаться
									дополнительно.
								</p>
								<br />

								<Button onClick={() => navigate(REGISTRATION_ROUTE)}>Продолжить регистрацию</Button>
							</div>
						</div>

						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>

			{/* <Footer /> */}
		</div>
	);
};

export default observer(Rules);
