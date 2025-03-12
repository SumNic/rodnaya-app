import React, { useEffect, useRef, useState } from 'react';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../../components/HeaderLogo/HeaderLogoRegistr';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import { PUBLICATION_ROUTE } from '../../utils/consts';
import Footer from '../../components/Footer';
import { useStoreContext } from '../../contexts/StoreContext';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useThemeContext } from '../../contexts/ThemeContext';
import { useSocket } from '../../hooks/useSocket';
import { PublicationWebsocketResponse } from '../../models/response/PublicationWebsocketResponse';

import styles from './Publications.module.css';
import Residency from '../../components/Residency';
import PublicationsList from './components/PublicationsList';
import { observer } from 'mobx-react-lite';
import { IPost } from '../../models/IPost';
import SendPublication from '../../components/sendPublications/SendPublication';
import { LocationUser } from '../../models/LocationUser';

interface PublicationsProps {}

//TODO Добавить сортировку публикаций

const Publications: React.FC<PublicationsProps> = ({}) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isFilter, setIsFilter] = useState(false);
	const [isLoadPublications, setIsLoadPublications] = useState(false);
	const [publications, setPublications] = useState<IPost[]>([]);
	const [page, setPage] = useState(1);

	const { store } = useStoreContext();
	const { territory } = store.locationStore;
	const { getAllPublications, publictionDataSocket, setPublicationDataSocket } = store.publicationStore;

	const { currentWidth } = useThemeContext();

	const { socket } = useSocket();

	const lastPublicationRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!lastPublicationRef.current) return;

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				loadPublications(territory, page);
			}
		});

		observer.observe(lastPublicationRef.current);

		return () => observer.disconnect();
	}, [publications]);

	useEffect(() => {
		setPublications([]);
		loadPublications(territory);
	}, [territory]);

	const loadPublications = async (territory: LocationUser, pageNumber = 1) => {
		try {
			setIsLoadPublications(true);
			const response = await getAllPublications(territory, pageNumber);
			if (response?.data && response?.data.length > 0) {
				setPublications((prev) => [...prev, ...response.data]); // Добавляем новые данные
				setPage(pageNumber + 1);
			}
			setIsLoadPublications(false);
		} catch (err) {
			setIsLoadPublications(false);
			console.error(`Ошибка в loadPublications: ${err}`);
		}
	};

	// Обработчик нажатия кнопки "Добавить публикацию"
	const handleAddButtonClick = () => {
		setIsEditing((prev) => !prev);
	};

	const handleFilterClick = () => {
		setIsFilter((prev) => !prev);
	};

	const handleFilterCancel = () => {
		setIsFilter(false);
	};

	useEffect(() => {
		const handleNewMessage = (data: PublicationWebsocketResponse) => {
			if (!data) return;
			// setPublications((prev) => prev.push(data))
			store.publicationStore.setPublicationDataSocket(data);
		};

		socket?.on('new_publication', handleNewMessage);

		// Очистка при размонтировании
		return () => {
			socket?.off('new_publication', handleNewMessage);
		};
	}, [socket]);

	useEffect(() => {
		if (
			publictionDataSocket &&
			(territory.locality === publictionDataSocket.resydency.locality ||
				(!territory.locality && territory.region === publictionDataSocket.resydency.region) ||
				(!territory.locality && !territory.region && territory.country === publictionDataSocket.resydency.country) ||
				Object.values(territory).every((value) => !value))
		) {
			const arrFileId = JSON.parse(publictionDataSocket.form.files);
			const newPost: IPost = {
				id: publictionDataSocket.id_publication,
				message: publictionDataSocket.form.message,
				location: publictionDataSocket.resydency.locality,
				blocked: false,
				userId: publictionDataSocket.id_user,
				files: arrFileId,
				user: {
					id: publictionDataSocket.id_user,
					first_name: publictionDataSocket.first_name,
					last_name: publictionDataSocket.last_name,
					photo_50: publictionDataSocket.photo_50,
				},
				createdAt: publictionDataSocket.createdAt,
			};

			if (newPost) {
				setPublications((prev) => [newPost, ...prev]);
				setPublicationDataSocket(undefined);
			}
		}
	}, [publictionDataSocket]);

	// Обработчик нажатия кнопки "Отменить"
	const handleCancel = () => {
		setIsEditing(false);
	};

	return (
		<div>
			<header className="header">
				<div className="header__wrapper">
					{currentWidth && currentWidth < 830 && <NavMiddle item={PUBLICATION_ROUTE} />}
					<HeaderLogoMobile />
					<HeaderLogoRegistr />
				</div>
			</header>

			<div className="middle">
				<div className="middle__wrapper">
					{currentWidth && currentWidth >= 830 && <NavMiddle item={PUBLICATION_ROUTE} />}
					<div className="main__screen main__screen_home">
						<div id="list_founders">
							<div className={styles.buttonsPublications}>
								{store.authStore.isAuth && (
									<Button
										onClick={handleAddButtonClick}
										style={{ width: '100%', marginTop: 8 }}
										icon={<PlusOutlined />}
									>
										Добавить
									</Button>
								)}
								<Button onClick={handleFilterClick} style={{ width: '100%', marginTop: 8 }}>
									Фильтр
								</Button>
							</div>
							{isFilter && <Residency onClick={handleFilterClick} onCancel={handleFilterCancel} />}

							{isEditing && (
								<div style={{ marginTop: 8 }}>
									<SendPublication handleCancel={handleCancel} />
								</div>
							)}
							<PublicationsList
								publications={publications}
								lastPublicationRef={lastPublicationRef}
								isLoadPublications={isLoadPublications}
							/>
						</div>

						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default observer(Publications);
