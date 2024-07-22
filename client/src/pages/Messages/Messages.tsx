import { observer } from "mobx-react-lite";
import Footer from "../../components/Footer";
import NavMiddle from "../../components/Nav_middle/NavMiddle";
import HeaderLogoMobile from "../../components/HeaderLogo/HeaderLogoMobile";
// import HeaderLogoPc from "../../components/HeaderLogoPc.tsx";
import NavRegions from "../../components/Nav_header/NavRegions";
import { useEffect, useMemo, useState } from "react";
// import { Context } from '..';
import { useNavigate, useParams } from "react-router-dom";
import MessagesService from "../../services/MessagesService";
import MessagesList from "./components/MessagesList";
import UploadFiles from "../../components/UploadFiles";
import SendMessage from "../../components/SendMessage";
import icon_attach from "../../images/clippy-icon1.png";
import { useStoreContext } from "../../contexts/StoreContext";
import { useAboutContext } from "../../contexts/AboutContext";
import { HOME_ROUTE, MESSAGES_ROUTE } from "../../utils/consts";
import { Modal, Typography } from "antd";
import HeaderLogoPc from "../../components/HeaderLogo/HeaderLogoPc";
import { useMessageContext } from "../../contexts/MessageContext.ts";

// interface IState {
//     file: File | undefined;
// }


const { Text } = Typography;

function Message() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    // const [endPostLocality, setEndPostLocality] = useState<number>(0);
    // const [endPostRegion, setEndPostRegion] = useState<number>(0);
    // const [endPostCountry, setEndPostCountry] = useState<number>(0);
    // const [endPostWorld, setEndPostWorld] = useState<number>(0);
    // const [fetchMessage, setFetchMessage] = useState<boolean>(false);

    const { store } = useStoreContext();
    const { posts, setPosts } = useAboutContext();
    // const { location, setLocation } = useMessageContext();
    const navigate = useNavigate();

    const params = useParams();
    const location: string | undefined = params.location;

    // useEffect(() => {
    //     if (paramsLocation) setLocation(paramsLocation)
    // }, []);
    // console.log(paramsLocation, 'paramsLocation');
    // console.log(location, 'location');

    useEffect(() => {
        // const id = UserService.getNumberLastReadMessage()
        if (location) {
            MessagesService.getAllMessages(
                store.user.id,
                store.user.secret.secret,
                location
            ).then((res) => setPosts([...res.data]));
            // document.querySelector(`#${endPost}`)?.scrollIntoView()

            store.setNewMessage(false);
        }
        
    }, [location, store.newMessage]);

    // useEffect(() => {
    //     // get id from URL
    //     // const id = ....

    //     document.querySelector(`#${id}`).scrollIntoView()
    //     }, [])

    function openNewMesseg() {}

    const nameLocal = useMemo(() => {
        let name = "";
        switch (location) {
            case "locality":
                name = store.user.residency.locality;
                break;
            case "region":
                name = store.user.residency.region;
                break;
            case "country":
                name = store.user.residency.country;
                break;
            case "world":
                name = "Земля";
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
                    <NavMiddle item={MESSAGES_ROUTE}/>
                    <div className="main__screen main__screen_home logotip-background">
                        <div className="name">
                            <h2 className="name__local" id="name">
                                {nameLocal}
                            </h2>
                        </div>
                        <div>
                            <a className="arrow__down" id="mylink" href="#"></a>
                        </div>
                        {/* <div className="main__text"> */}
                            {location && <MessagesList posts={posts} location={location}/>}

                            {/* <div id="button__message">
                                <button id="button" onClick={openNewMesseg}>
                                    У вас есть непрочитанные сообщения.
                                    Показать?
                                </button>
                            </div> */}
                        {/* </div> */}
                        <div id="messages">
                            <UploadFiles />

                            <div id="forms">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={modalOpen}
                onOk={() => navigate(HOME_ROUTE)}
                onCancel={() => setModalOpen(false)}
                width={400}
            >
                <Text>Страница не существует. Вернуться на главную?</Text>
            </Modal>
            <Footer />
        </div>
    );
}

export default observer(Message);
