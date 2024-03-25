import { observer } from 'mobx-react-lite';
import Footer from '../components/Footer';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../components/HeaderLogoMobile';
import HeaderLogoPc from '../components/HeaderLogoPc';
import NavRegions from '../components/Nav_header/NavRegions';
import { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import icon_attach from '../images/clippy-icon1.png'
import { useParams } from 'react-router-dom';
import MessagesService from '../services/MessagesService';
import MessagesList from '../components/MessagesList';
import UploadFiles from '../components/UploadFiles';

interface IState {
  file: File | undefined;
}

const initialState: IState = {
  file: undefined
}

function Message() {

    const {store} = useContext(Context)
    const [posts, setPosts] = useState<any>([])
    const [message, setMessage] = useState<string>('')
    const [fetchMessage, setFetchMessage] = useState<boolean>(false)
    const [endPost, setEndPost] = useState<number>(0)

    const params = useParams();
    const location: string | undefined = params.location

    useEffect(() => {
        setMessage('')
        // const id = UserService.getNumberLastReadMessage()
        MessagesService.getAllMessages(store.user.id, store.user.secret.secret, location)
            .then((data) => setPosts(data.data))
        // document.querySelector(`#${endPost}`)?.scrollIntoView()
    }, [location, fetchMessage])

    

    // useEffect(() => {
    //     // get id from URL
    //     // const id = ....

    //     document.querySelector(`#${id}`).scrollIntoView()
    //     }, [])

    function openNewMesseg() {

    }

    async function sendMessage(e: any) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        
        const formData = new FormData(form);


        const formJson = Object.fromEntries(formData.entries());
        
        const resp_id = await store.sendMessage(store.user.id, store.user.secret.secret, location, formJson)
        setEndPost(+resp_id)

        setMessage('')
        setFetchMessage((val) => !val)
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
                            <div id="message__ajax">
                                
                                <MessagesList posts={posts}/>

                            </div>	
                            <div id="button__message">
                                <button id="button" onClick={openNewMesseg}>У вас есть непрочитанные сообщения. Показать?</button>
                            </div>
                        </div>
                        <div id="messages">
                            <div id="div_message">
                                <p id="message_message"></p>
                            </div>
                            <div id="show_clip">
                                <p id="progress_start"></p>
                            </div>
                            <progress id="progress" value="0" max="100" style={{display: "none"}}></progress>

                            <div id="forms">
                                <UploadFiles />
                                {/* <form name="load_message" id="load_message">
                                    <div className="clip">
                                        <div className="label-clip">
                                            <label htmlFor="fileToUpload">
                                                <img src={icon_attach} alt="Прикрепить" className="clippy-icon" />
                                                <input type="file" id="fileToUpload" name="fileToUpload" defaultValue="" style={{display: "none"}} />
                                            </label>
                                        </div>
                                    </div>
                                </form> */}
                                <form name="send_message" id="send_message" method="post" onSubmit={sendMessage}>
                                    {/* <div className="clip">
                                        <div className="label-clip">
                                            <label htmlFor="fileToUpload">
                                                <img src={icon_attach} alt="Прикрепить" className="clippy-icon" />
                                                <input type="file" id="fileToUpload" name="fileToUpload" defaultValue="" style={{display: "none"}} />
                                            </label>
                                        </div>
                                    </div> */}
                                    <div className="message">
                                        <textarea 
                                            id="message" 
                                            name="message" 
                                            placeholder="Введите сообщение" 
                                            value={message} 
                                            onChange={(e) => setMessage(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="class_none">
                                        <p id="clip_files"></p>
                                    </div>
                                    <div className="send">
                                        <button type="submit" className="submit-send"></button>
                                    </div>
                                </form>
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