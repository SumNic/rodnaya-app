import { observer } from 'mobx-react-lite';
import Footer from '../components/Footer';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../components/HeaderLogoMobile';
import HeaderLogoPc from '../components/HeaderLogoPc';
import NavRegions from '../components/Nav_header/NavRegions';
import { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import { useParams } from 'react-router-dom';
import MessagesService from '../services/MessagesService';
import MessagesList from '../components/MessagesList';
import UploadFiles from '../components/UploadFiles';
import SendMessage from '../components/SendMessage';
import icon_attach from '../images/clippy-icon1.png'

interface IState {
  file: File | undefined;
}

const initialState: IState = {
  file: undefined
}

function Message() {

    const {store} = useContext(Context)
    
    const [posts, setPosts] = useState<any>([])
    const [endPost, setEndPost] = useState<number>(0)
    const [fetchMessage, setFetchMessage] = useState<boolean>(false)

    const params = useParams();
    const location: string | undefined = params.location

    useEffect(() => {
        // const id = UserService.getNumberLastReadMessage()
        MessagesService.getAllMessages(store.user.id, store.user.secret.secret, location)
            .then((data) => setPosts(data.data))
        // document.querySelector(`#${endPost}`)?.scrollIntoView()

        store.setNewMessage(false)
    }, [location, store.newMessage])

    // useEffect(() => {
    //     // get id from URL
    //     // const id = ....

    //     document.querySelector(`#${id}`).scrollIntoView()
    //     }, [])

    function openNewMesseg() {

    }

    return (
        <div>
            <header className="header">
                <div className="header__wrapper">
                    <HeaderLogoPc />
                    <HeaderLogoMobile />
                    {location && <NavRegions location={location}/>}
                </div>
            </header>

            <div className="middle">
                <div className="middle__wrapper">
                    <NavMiddle />
                    <div className="main__screen main__screen_home">
                        <div className="name">
                            <h2 className="name__local" id="name">
                                {location === 'locality' && store.user.residency.locality}
                                {location === 'region' && store.user.residency.region}
                                {location === 'country' && store.user.residency.country}
                                {location === 'world' && 'Земля'}
                            </h2>
                        </div>
                        <div>
                            <a className="arrow__down" id="mylink" href="#"></a>
                        </div>
                        <div className="main__text">

                            <MessagesList posts={posts}/>

                            <div id="button__message">
                                <button id="button" onClick={openNewMesseg}>У вас есть непрочитанные сообщения. Показать?</button>
                            </div>
                        </div>
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

            <Footer />

        </div>
    );
    
}

export default observer(Message);