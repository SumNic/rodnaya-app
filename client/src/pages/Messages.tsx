import { observer } from 'mobx-react-lite';
import AuthVkButton from '../components/AuthVkButton';
import Footer from '../components/Footer';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../components/HeaderLogoMobile';
import HeaderLogoPc from '../components/HeaderLogoPc';
import NavRegions from '../components/Nav_header/NavRegions';
import { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import MyButtonIcon from '../components/MyButtonIcon';
import icon_edit from '../images/icon-edit.png'
import icon_attach from '../images/clippy-icon1.png'
import OnChangeForm from '../components/OnChangeForm';
import { useParams } from 'react-router-dom';
import MessagesService from '../services/MessagesService';
import { PERSONALE_CARD_ROUTE } from '../utils/consts';

function Message() {

    const {store} = useContext(Context)

    const params = useParams();
    const location: string | undefined = params.location

    function openNewMesseg() {

    }

    // function sendMessage() {
    //     store.sendMessage(store.user, location, )

    // } 

    async function sendMessage(e: any) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        
        await store.sendMessage(store.user.id, store.user.secret.secret, location, formJson)
    }

    function openInfo() {

    }

    function foulSend() {

    }

    const mess = 
        <div className="mes__wrapper">
        {/* <div name="ses'.$user['id'].'" className="mes__wrapper"></div> */}
            <a href={PERSONALE_CARD_ROUTE} id="'.$vk_id.'" onClick={openInfo}><img className="mes_foto" src="' . $user['photo_50'] . '" /></a>
            <div className="name__first_last">
                <a href={PERSONALE_CARD_ROUTE} className="name__first"><p className="name__first">{store.user.first_name}</p></a>
                <a href={PERSONALE_CARD_ROUTE} className="name__first"><p className="name__first">{store.user.last_name}</p></a>
                <p className="name__time">' . date("H:i", strtotime($user['time'])) . '</p>
                <div className="foul">
                    <select id="foul'.$user['id'].'" name="foul" className="foul_select" onChange={foulSend}>
                        <option></option>
                        <option className="foul__mes" id="foul__mes'.$user['id'].'" value="'.$user['id'].'">нарушение правил</option>
                    </select>
                    <p id="foul__respons"></p>
                </div>
            </div>
            <div id="mes_message'.$user['id'].'" className="mes_message">' . nl2br($user['message']) . '</div>
            {/* <div name="top'.$user['id'].'" id="mes_message'.$user['id'].'" className="mes_message">' . nl2br($user['message']) . '</div> */}
            <div className="div_name_file">
                <a href="../uploads/' . $sign . '" className="name__file">' . $name_file . '</a>
            </div>
        </div>

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
                                {mess}
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
                                <form name="load_message" id="load_message">
                                    <div className="clip">
                                        <div className="label-clip">
                                            <label htmlFor="fileToUpload">
                                                <img src={icon_attach} alt="Прикрепить" className="clippy-icon" />
                                                <input type="file" id="fileToUpload" name="fileToUpload" defaultValue="" style={{display: "none"}} />
                                            </label>
                                        </div>
                                    </div>
                                </form>
                                {/* <form name="send_message" id="send_message"> */}
                                <form name="send_message" id="send_message" method="post" onSubmit={sendMessage}>
                                    <div className="message">
                                        <textarea id="message" name="message" placeholder="Введите сообщение" />
                                    </div>
                                    <div className="class_none">
                                        {/* <input type="hidden" id="id_person" name="id_person" value={store.user.id} />
                                        <input type="hidden" id="secret_person" name="secret_person" value={store.user.secret.secret} /> */}
                                        
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