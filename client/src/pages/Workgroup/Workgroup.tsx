import { observer } from 'mobx-react-lite';
import Footer from '../../components/Footer';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import NavRegions from '../../components/Nav_header/NavRegions';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useStoreContext } from '../../contexts/StoreContext';
import ModalNewWorkgroup from './components/ModalNewWorkgroup';
import HeaderLogoPc from '../../components/HeaderLogo/HeaderLogoPc';
import { WORKGROUP_ROUTE } from '../../utils/consts';
import { Typography } from 'antd';

const { Title } = Typography;

const Workgroup: React.FC = () => {
	const { store } = useStoreContext();

	const params = useParams();
	const location: string | undefined = params.location;

	return (
		<div>
			<header className="header">
				<div className="header__wrapper">
					<HeaderLogoPc />
					<HeaderLogoMobile />
					{location && <NavRegions location={location} />}
				</div>
			</header>

			<div className="middle">
				<div className="middle__wrapper">
					<NavMiddle item={WORKGROUP_ROUTE} />
					<div className="main__screen main__screen_home logotip-background">
						<ModalNewWorkgroup />

						<div className="name">
							<h2 className="name__local" id="name">
								{location === 'locality' && store.user.residency.locality}
								{location === 'region' && store.user.residency.region}
								{location === 'country' && store.user.residency.country}
								{location === 'world' && 'Земля'}
							</h2>
						</div>
						{/* <div>
                            <a
                                className="plus"
                                id="mylink"
                                style={{ cursor: "pointer" }}
                                onClick={addNewWorkgroup}
                            ></a>
                        </div> */}
						<div className="main__text">
							<Title level={2} style={{ fontSize: '18px' }}>
								Этот раздел находится в разработке. В будущем здесь будет доступна возможность создания рабочих
								(инициативных) групп для решения конкретных задач.
							</Title>
							{/* <MessagesList posts={posts} /> */}

							<div id="button__message">
								{/* <button id="button" onClick={openNewMesseg}>
                                    У вас есть непрочитанные сообщения.
                                    Показать?
                                </button> */}
							</div>
						</div>
						<div id="messages">
							{/* <UploadFiles /> */}

							{/* <div id="forms">
                                <div className="clip">
                                    <div className="label-clip">
                                        <label htmlFor="fileToUpload">
                                            <img
                                                className="clippy-icon"
                                                src={icon_attach}
                                                alt="Прикрепить"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {location && (
                                    <SendMessage location={location} />
                                )}
                            </div> */}
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default observer(Workgroup);
