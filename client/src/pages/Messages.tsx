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
    
    await MessagesService.sendMessage(store.user, location, formJson)
  }   

    return (
        <div>
            <header className="header">
                <div className="header__wrapper">
                    <HeaderLogoPc />
                    <HeaderLogoMobile />
                    <NavRegions />
                </div>
            </header>

            <div className="middle">
                <div className="middle__wrapper">
                    <NavMiddle />
                    <div className="main__screen main__screen_home">
                        <div className="name">
                            <h2 className="name__local" id="name">
                                {location === 'personale' && 'Личные сообщения'}
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
                                            <label htmlFor="fileToUpload"><img src={icon_attach} alt="Прикрепить" className="clippy-icon"></img></label>
                                            <input type="file" id="fileToUpload" name="fileToUpload" value="" style={{display: "none"}}></input>
                                        </div>
                                    </div>
                                </form>
                                <form name="send_message" id="send_message">
                                    <div className="message">
                                        <textarea id="message" name="message" autoFocus={true} placeholder="Введите сообщение"></textarea>
                                    </div>
                                    <div className="class_none">
                                        {/* <input type="hidden" id="id_person" name="id_person" value="'.$user['id'].'"></input>
                                        <input type="hidden" id="first_name" name="first_name" value="'.$user['first_name'].'"></input>
                                        <input type="hidden" id="last_name" name="last_name" value="'.$user['last_name'].'"></input>
                                        <input type="hidden" id="photo_50" name="photo_50" value="'.$user['photo_50'].'"></input>
                                        <input type="hidden" id="solution" name="solution" value="1"></input>
                                        <input type="hidden" id="land" name="land" value="country"></input>
                                        <input type="hidden" id="locality" name="locality" value="'.$locality.'"></input>
                                        <input type="hidden" id="region" name="region" value="'.$region.'"></input>
                                        <input type="hidden" id="country" name="country" value="'.$country.'"></input> */}
                                        
                                        <p id="clip_files"></p>
                                    </div>
                                    <div className="send">
                                        <a href="#" className="submit-send" onClick={sendMessage}></a>
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