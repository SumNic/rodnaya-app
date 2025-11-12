import { observer } from 'mobx-react-lite';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../../components/HeaderLogo/HeaderLogoRegistr';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { IUser } from '../../models/IUser';
import UserService from '../../services/UserService';
import { useThemeContext } from '../../contexts/ThemeContext';
import { EnvironmentOutlined, MessageOutlined, ReadOutlined, SolutionOutlined } from '@ant-design/icons/lib/icons';
import styles from './PersonalePage.module.css';
import { Button, Typography } from 'antd';
import { VkIcon } from '../../UI/icons/VkIcon';
import { useStoreContext } from '../../contexts/StoreContext';
// import { IPost } from '../../models/IPost';
import PublicationsList from '../Publications/components/PublicationsList';
import { EditIcon } from '../../UI/icons/EditIcon';
import Declaration from '../../components/Declaration';
import EditProfile from '../../components/EditProfile';
import OnChangeForm from '../../components/OnChangeForm';
import PersonaleData from '../../components/PersonaleData';
import UploadAvatar from '../../components/UploadAvatar';
import { PERSONALE_ROUTE } from '../../utils/consts';
import { PublicationWithPartialUser } from '../Publications/Publications';
import { Publication } from '../../services/PublicationsService';

const { Title } = Typography;

const PersonalePage: React.FC = () => {
	const [user, setuser] = useState<IUser>();
	const [isDeclarationVisible, setIsDeclarationVisible] = useState(true);
	const [isLoadPublications, setIsLoadPublications] = useState(false);
	const [isPublicationsVisible, setIsPublicationsVisible] = useState(false);
	const [publications, setPublications] = useState<PublicationWithPartialUser[]>([]);
	const [page, setPage] = useState(1);
	const [isOwnerPage, setIsOwnerPage] = useState(false);

	const { id } = useParams();

	const { currentWidth, currentColorScheme } = useThemeContext();

	const { store } = useStoreContext();
	const { getUserPublications } = store.publicationStore;

	const lastPublicationRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!lastPublicationRef.current) return;

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && user?.id) {
				loadUserPublications(user.id, page);
			}
		});

		observer.observe(lastPublicationRef.current);

		return () => observer.disconnect();
	}, [publications]);

	useEffect(() => {
		getuser();
	}, [id, store.authStore.user]);

	useEffect(() => {
		if (store.authStore.user?.id && user?.id && store.authStore.user?.id === user?.id) setIsOwnerPage(true);
	}, [id, user]);

	const getuser = async () => {
		try {
			if (id) {
				const user = await UserService.getUser(+id);
				if (user.data) setuser(user.data);
			}
		} catch (error) {
			console.log(`Ошибка в getuser? Personale_kard: ${error}`);
		}
	};

	const handlePublicationsButtonClick = async () => {
		setPublications([]);
		setIsDeclarationVisible(false);
		setIsPublicationsVisible(true);
		if (user?.id) loadUserPublications(user.id);
	};

	const mapApiToPublicationWithLocation = (p: Publication): PublicationWithPartialUser => ({
		...p,
		location: '',
	});

	const loadUserPublications = async (id: number, pageNumber = 1) => {
		try {
			setIsLoadPublications(true);
			const response = await getUserPublications(id, pageNumber);
			if (response?.data && response?.data.length > 0) {
				const mapData = response.data.map((publication) => mapApiToPublicationWithLocation(publication));
				setPublications((prev) => [...prev, ...mapData]); // Добавляем новые данные
				setPage(pageNumber + 1);
			}
			setIsLoadPublications(false);
		} catch (err) {
			setIsLoadPublications(false);
			console.error(`Ошибка в loadUserPublications: ${err}`);
		}
	};

	const handleDeclarationButtonClick = () => {
		setIsPublicationsVisible(false);
		setIsDeclarationVisible(true);
	};

	const query = [user?.residency.country, user?.residency.region, user?.residency.locality].filter(Boolean).join(', ');
	const yandexMapsUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(query)}`;

	const openVkProfile = () => {
		window.open(`https://vk.ru/id${user?.vk_id}`, '_blank');
	};

	const personaleData = (
		<>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<h2 className={styles.h2_style}>Учредитель Родной партии</h2>
				{isOwnerPage && (
					<Button
						onClick={() => store.authStore.setIsEditProfile(true)}
						className={styles.edit}
						icon={<EditIcon width="20px" fill={currentColorScheme.dragEndDropCollapse} />}
					/>
				)}
			</div>
			<div className={styles.wrapper}>
				<img className={styles.photo} src={user?.photo_max} alt="Ваше фото"></img>
				<div className={styles.personale_wrapper} style={{ paddingBottom: 0 }}>
					<p className={styles.p_style}>
						{user?.first_name} {user?.last_name}
					</p>
					<div className={styles.residency}>
						<a href={yandexMapsUrl} target="_blank" rel="noopener noreferrer" title="Открыть в Яндекс.Картах">
							<EnvironmentOutlined />
						</a>
						<p className={styles.p_style}>
							{user?.residency.country}, {user?.residency.region}, {user?.residency.locality}
						</p>
					</div>

					<div className={styles.buttonsPublications}>
						<Button
							// onClick={handleAddButtonClick}
							className={styles.button}
							icon={<MessageOutlined />}
						>
							{currentWidth && currentWidth > 550 ? 'Написать' : ''}
						</Button>
						<Button
							onClick={openVkProfile}
							className={styles.button}
							icon={<VkIcon width="20px" fill={currentColorScheme.vkIconBg} />}
						>
							{currentWidth && currentWidth > 550 ? 'Профиль' : ''}
						</Button>
						<Button onClick={handlePublicationsButtonClick} className={styles.button} icon={<SolutionOutlined />}>
							{currentWidth && currentWidth > 550 ? 'Публикации' : ''}
						</Button>
						<Button
							onClick={handleDeclarationButtonClick}
							className={styles.button}
							icon={<ReadOutlined />}
							disabled={!user?.declaration?.declaration}
						>
							{currentWidth && currentWidth > 550 ? 'Декларация' : ''}
						</Button>
					</div>
				</div>
			</div>
			{isDeclarationVisible && user?.declaration?.declaration && (
				<>
					<div style={{ width: '100%', display: 'block' }}>
						<h2 style={{ fontSize: '21px', marginBottom: 0, textAlign: 'center' }}>Декларация моей Родной партии:</h2>
					</div>
					<div style={{ width: '100%' }}>
						<p className={styles.p_style} style={{ whiteSpace: 'pre' }}>
							{user?.declaration?.declaration}
						</p>
					</div>
				</>
			)}
			{isPublicationsVisible && (
				<>
					<div style={{ width: '100%', display: 'block' }}>
						<h2 style={{ fontSize: '21px', marginBottom: 0, textAlign: 'center' }}>Публикации:</h2>
					</div>
					<PublicationsList
						publications={publications}
						lastPublicationRef={lastPublicationRef}
						isLoadPublications={isLoadPublications}
					/>
				</>
			)}
		</>
	);

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
					<div className="main__screen main__screen_home">
						<div id="list_founders" style={{ paddingBottom: '20px' }}>
							{!store.authStore.isEditProfile && personaleData}
							{store.authStore.isEditProfile && (
								<>
									<Title level={2} style={{ textAlign: 'center', fontSize: '20px' }}>
										Учредитель:
									</Title>
									<div className={styles.avatarWrapper}>
										<UploadAvatar />
										<img className={styles.edit_photo} src={user?.photo_max} alt="Ваше фото" />
										<label
											htmlFor="avatarToUpload"
											style={{
												fontSize: '18px',
											}}
										>
											<div style={{ display: 'flex', flexWrap: 'wrap' }}>
												<p className={styles.text}>Изображение должно быть квадратным.</p>
												<p className={styles.text}>Сменить изображение?</p>
												<EditIcon width="20px" fill={currentColorScheme.dragEndDropCollapse} />
											</div>
										</label>
									</div>
								</>
							)}
							{store.authStore.isEditProfile && <PersonaleData />}
							{store.authStore.isEditProfile && (
								<OnChangeForm id={store.authStore.user.id} secret={store.authStore.user.secret} />
							)}
							{store.authStore.isEditProfile && <Declaration />}
							{store.authStore.isEditProfile && <EditProfile />}
						</div>

						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>

			{/* <Footer /> */}
		</div>
	);
};

export default observer(PersonalePage);
