import { observer } from 'mobx-react-lite';
import Footer from '../../components/Footer';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import NavRegions from '../../components/Nav_header/NavRegions';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MessagesService from '../../services/MessagesService';
import MessagesList from './components/MessagesList';
import UploadFiles from '../../components/UploadFiles';
import SendMessage from '../../components/SendMessage';
import icon_attach from '../../images/clippy-icon1.png';
import { useStoreContext } from '../../contexts/StoreContext';
import { useAboutContext } from '../../contexts/AboutContext';
import { HOME_ROUTE, LocationEnum, MESSAGES_ROUTE } from '../../utils/consts';
import { Modal, Spin, Typography } from 'antd';
import HeaderLogoPc from '../../components/HeaderLogo/HeaderLogoPc';
import { useMessageContext } from '../../contexts/MessageContext.ts';

const { Text } = Typography;

function Message() {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
    
    const [isMemoizedIndexMap, setMemoizedIndexMap] = useState(true);

	const { store } = useStoreContext();
	const { posts, setPosts } = useAboutContext();
    const { isLoading, setIsLoading, sendMessageId } = useMessageContext()
	const navigate = useNavigate();

	const params = useParams();
	const location: string | undefined = params.location;

    const memoizedIndexMap = useMemo(() => {
        if (isMemoizedIndexMap) {
            const entries = Object.values(LocationEnum).filter((type): type is LocationEnum => typeof type === 'string');
            return entries.map((item, index) => ({ item: String(item), index }));
        }
        setMemoizedIndexMap(false);
    }, [isMemoizedIndexMap]);

	useEffect(() => {
		if (location) {
            if (sendMessageId) {
                store.setNewMessage(false);
			    loadMessages(sendMessageId, location);
            } else {
                const endIdMessage: number = store.arrEndMessagesId.reduce((accum, item, index) => {
                    const indexLocation = memoizedIndexMap?.findIndex(({ item }) => item === location);
                    if (indexLocation === index) {
                        return accum + item.id;
                    }
                    return accum;
                }, 0);
    
                store.setNewMessage(false);    
                loadMessages(endIdMessage, location);
            }			
		}
	}, [location, sendMessageId]);

	useEffect(() => {
		const handleScroll = () => {
            const messagesElement = document.getElementById("div__messages");
            const scrollHeight = messagesElement?.scrollHeight;
            const scrollTop = messagesElement?.scrollTop;
            const clientHeight = messagesElement?.clientHeight;

            if (scrollHeight && scrollTop && clientHeight) {
                if (scrollTop < 3 && !isLoading) {
                    loadPreviousMessages();
                } else if (scrollHeight - scrollTop - clientHeight < 3 && !isLoading) {
                    loadNextMessages();
                }
            }
		};

		document.getElementById('div__messages')?.addEventListener('scroll', handleScroll);
		return () => document.getElementById('div__messages')?.removeEventListener('scroll', handleScroll);
	}, [isLoading, posts]);

	const loadMessages = async (endIdMessage: number, location: string) => {
		try {
			const allMessages = await MessagesService.getAllMessages(
				store.user.id,
				endIdMessage || -1,
				store.user.secret.secret,
				location
			);
			if (allMessages) setPosts([...Object.values(allMessages.data)]);
		} catch (err) {
            console.error(`Ошибка в loadMessages: ${err}`)
		}
	};

    const loadPreviousMessages = async () => {
		setIsLoading(true);
		try {
            if (posts && posts[0]?.id) {
                const newPosts = await MessagesService.getPreviousMessages(
                    store.user.id,
                    posts[0]?.id,
                    store.user.secret.secret,
                    location
                );
                if (newPosts) setPosts([...Object.values(newPosts.data), ...posts]);
            }
			
		} catch (err) {
            console.error(`Ошибка в loadPreviousMessages: ${err}`)
		}
		setIsLoading(false);
	};

	const loadNextMessages = async () => {
		setIsLoading(true);
		try {
            if (posts) {
                const newMessages = await MessagesService.getNextMessages(
                    store.user.id,
                    posts[posts.length - 1].id,
                    store.user.secret.secret,
                    location
                );
                if (newMessages) setPosts([...posts, ...Object.values(newMessages.data)]);
            }
		} catch (err) {
            console.error(`Ошибка в loadNextMessages: ${err}`)
		}
		setIsLoading(false);
	};

	const nameLocal = useMemo(() => {
		let name = '';
		switch (location) {
			case 'locality':
				name = store.user.residency.locality;
				break;
			case 'region':
				name = store.user.residency.region;
				break;
			case 'country':
				name = store.user.residency.country;
				break;
			case 'world':
				name = 'Земля';
				break;
			default:
				setModalOpen(true);
				break;
		}
		return name;
	}, [location]);
    
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
					<NavMiddle item={MESSAGES_ROUTE} />
					<div className="main__screen main__screen_home logotip-background">
						<div className="name">
							<h2 className="name__local" id="name">
								{nameLocal}
							</h2>
						</div>
						<div>
							<a className="arrow__down" id="mylink" href={`${posts?.[length - 1]?.id}`}></a>
						</div>
						{location && posts && <MessagesList posts={posts} location={location} />}
						{/* {!isLoading && <div className="loading-indicator">Загрузка...</div>} */}
						<div id="messages">
							<UploadFiles />

							<div id="forms">
								<div className="clip">
									<div className="label-clip">
										<label htmlFor="fileToUpload">
											<img className="clippy-icon" src={icon_attach} alt="Прикрепить" />
										</label>
									</div>
								</div>

								{location && <SendMessage location={location} />}
							</div>
						</div>
					</div>
				</div>
			</div>
			<Modal open={modalOpen} onOk={() => navigate(HOME_ROUTE)} onCancel={() => setModalOpen(false)} width={400}>
				<Text>Страница не существует. Вернуться на главную?</Text>
			</Modal>
			<Footer />
		</div>
	);
}

export default observer(Message);
