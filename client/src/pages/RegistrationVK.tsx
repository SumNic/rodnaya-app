import React, { Component } from 'react';
import AuthVkButton from '../components/AuthVkButton';
import ConditionsForm from '../components/ConditionsForm';
import Footer from '../components/Footer';
import FooterCondition from '../components/FooterCondition';
import HeaderLogoRegistr from '../components/HeaderLogoRegistr';
import MyButtonNext from '../components/MyButtonNext/MyButtonNext';

class RegistrationVK extends Component {
    render() {
        return (
            <div>
                <header className="header">
                    < HeaderLogoRegistr />
                </header>

                <div className="middle">
                    <div className="middle__wrapper">
                        <div className="main__screen main__screen__registr" style={{backgroundSize: "491.4px 491.4px"}}>
                            <div className="form__registr" style={{textAlign: "justify"}}>

                                <div className="registr__block" style={{display: "block"}}>
                                    <h2 className="personale_h2">Регистрация на сайте состоит из двух этапов:</h2><br/>
                                    <p className="personale_p">1. Ауторизация с помощью ВК.</p>
                                    <p className="personale_p">Она используется только на этапе регистрации для того, чтобы уменьшить количество возможных ботов на сайте. 
                                        Также будут взяты с вашей страницы ВК фотография, имя и фамилия (на фотографии должно быть ваше фото, а 
                                        также должны быть настоящие имя и фамилия). Они будут использоваться для создания вашей персональной страницы на сайте Родная партия. 
                                        При этом сайт Родная партия к вашей странице ВК доступ не получает, а берет лишь общедоступные сведения.</p>
                                    <p className="personale_p">2. Регистрация по электронной почте.</p>
                                    <p className="personale_p">Необходимо будет ввести ваш адрес электронной почты и придумать пароль. Затем будет необходимо подтвердить почту,
                                        перейдя по ссылке, которая придет вам на указанный электронный адрес. В дальнейшем, для входа на сайт нужны будут только емеил и пароль.</p>
                                    <p className="personale_p">Если вы готовы продолжить, то нажимайте кнопку Регистрация ВК.</p>
                                </div>

                                <AuthVkButton />
                                {/* <div id="id"></div> */}
                                
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />

            </div>
        );
    }
}

export default RegistrationVK;