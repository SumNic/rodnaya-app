import { observer } from 'mobx-react-lite';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../../components/HeaderLogo/HeaderLogoRegistr';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';
import {
	EditOutlined,
	EnvironmentOutlined,
	MessageOutlined,
	ReadOutlined,
	SolutionOutlined,
} from '@ant-design/icons/lib/icons';
import styles from './PersonalePage.module.css';
import { Button, Typography } from 'antd';
import { VkIcon } from '../../UI/icons/VkIcon';
import { useStoreContext } from '../../contexts/StoreContext';
import PublicationsList from '../Publications/components/PublicationsList';
import { EditIcon } from '../../UI/icons/EditIcon';
import Declaration from '../../components/Declaration';
import EditProfile from '../../components/EditProfile';
import OnChangeForm from '../../components/OnChangeForm';
import PersonaleData from '../../components/PersonaleData';
import { API_URL, PERSONALE_ROUTE } from '../../utils/consts';
import { PublicationWithPartialUser } from '../Publications/Publications';
import { Publication } from '../../services/PublicationsService';
import UploadAntdFiles from '../../components/UploadAntdFiles/UploadAntdFiles';
import { parseIsUrlProtocol } from '../../utils/function';
import ExpandableText from '../../components/ExpandableText/ExpandableText';
import { User } from '../../services/UserService';

const { Title } = Typography;

const PersonalePage: React.FC = () => {
	const [isDeclarationVisible, setIsDeclarationVisible] = useState(true);
	const [isLoadPublications, setIsLoadPublications] = useState(false);
	const [isPublicationsVisible, setIsPublicationsVisible] = useState(false);
	const [publications, setPublications] = useState<PublicationWithPartialUser[]>([]);
	const [page, setPage] = useState(1);
	const [isOwnerPage, setIsOwnerPage] = useState(false);
	const [isChangeAvatar, setIsChangeAvatar] = useState(false);
	const [profile, setProfile] = useState<User | null>(null);

	const { id } = useParams();

	const { currentWidth, currentColorScheme } = useThemeContext();

	const { store } = useStoreContext();
	const { getUserPublications } = store.publicationStore;
	const { files, resetFiles } = store.filesStore;
	const { user, updatePersonaleData } = store.authStore;

	const lastPublicationRef = useRef<HTMLDivElement | null>(null);
	const uploadRef = useRef<any>(null);

	useEffect(() => {
		if (!id) return;

		const fetchProfile = async () => {
			const result = await store.authStore.getUser(Number(id));
			setProfile(result.data);
		};

		fetchProfile();
	}, [id]);

	useEffect(() => {
		setProfile(user);
	}, [user]);

	useEffect(() => {
		if (!lastPublicationRef.current) return;

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && profile?.id) {
				loadUserPublications(profile.id, page);
			}
		});

		observer.observe(lastPublicationRef.current);

		return () => observer.disconnect();
	}, [publications]);

	useEffect(() => {
		if (store.authStore.user?.id && profile?.id && store.authStore.user.id === profile.id) setIsOwnerPage(true);
		else setIsOwnerPage(false);
	}, [id, user, profile]);

	// Очистка файлов во время загрузки, чтобы сменить аватар, например
	useEffect(() => {
		resetFiles();
	}, [store.filesStore, resetFiles]);

	const handlePublicationsButtonClick = async () => {
		setPublications([]);
		setIsDeclarationVisible(false);
		setIsPublicationsVisible(true);
		if (profile?.id) loadUserPublications(profile.id);
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

	const query = [profile?.residency.country, profile?.residency.region, profile?.residency.locality]
		.filter(Boolean)
		.join(', ');
	const yandexMapsUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(query)}`;

	const openVkProfile = () => {
		window.open(`https://vk.ru/id${profile?.vk_id}`, '_blank');
	};

	useEffect(() => {
		if (isChangeAvatar && files.length) {
			updatePersonaleData({ id: profile?.id, photo_50: files[0].fileNameUuid, photo_max: files[0].fileNameUuid });
		}
	}, [isChangeAvatar, files.length]);

	const handleClick = () => {
		setIsChangeAvatar(true);
		const input = uploadRef.current?.upload?.uploader?.fileInput;
		if (input) input.click();
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
				<img
					className={styles.profile_photo}
					src={
						profile?.photo_max && parseIsUrlProtocol(profile?.photo_max)
							? profile?.photo_max
							: `${API_URL}/file/${profile?.photo_max}`
					}
					alt="Ваше фото"
				/>
				<div className={styles.personale_wrapper} style={{ paddingBottom: 0 }}>
					<p className={styles.p_style}>
						{profile?.first_name} {profile?.last_name}
					</p>
					<div className={styles.residency}>
						<a href={yandexMapsUrl} target="_blank" rel="noopener noreferrer" title="Открыть в Яндекс.Картах">
							<EnvironmentOutlined />
						</a>
						<p className={styles.p_style}>
							{profile?.residency.country}, {profile?.residency.region}, {profile?.residency.locality}
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
							disabled={!profile?.declaration?.declaration}
						>
							{currentWidth && currentWidth > 550 ? 'Декларация' : ''}
						</Button>
					</div>
				</div>
			</div>
			{isDeclarationVisible && profile?.declaration?.declaration && (
				<>
					<div style={{ width: '100%', display: 'block' }}>
						<h2 className={styles.titleH2}>Декларация моей Родной партии:</h2>
					</div>
					<div style={{ width: '100%', fontFamily: 'Inter' }}>
						<ExpandableText text={profile?.declaration?.declaration} />
					</div>
				</>
			)}
			{isPublicationsVisible && (
				<>
					<div style={{ width: '100%', display: 'block' }}>
						<h2 className={styles.titleH2}>Публикации:</h2>
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
					<div className={`main__screen main__screen_home ${styles.wrapper}`}>
						<div id={'list_founders'} style={{ paddingBottom: '20px' }}>
							{!store.authStore.isEditProfile && personaleData}
							{store.authStore.isEditProfile && (
								<>
									<Title level={2} style={{ textAlign: 'center', fontSize: '20px' }}>
										Учредитель:
									</Title>
									<UploadAntdFiles isHiddenButton={true} uploadRef={uploadRef} isShowFileList={false} />
									<div className={styles.avatarWrapper} onClick={handleClick}>
										<img
											className={styles.edit_photo}
											src={
												profile?.photo_max && parseIsUrlProtocol(profile.photo_max)
													? profile.photo_max
													: `${API_URL}/file/${profile?.photo_max}`
											}
											alt="Ваше фото"
										/>
										<div className={styles.overlay}>
											<EditOutlined className={styles.edit_icon} />
										</div>
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
