import { observer } from 'mobx-react-lite';
import AuthVkButton from '../components/AuthVkButton';
import Footer from '../components/Footer';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../components/HeaderLogoMobile';
import HeaderLogoPc from '../components/HeaderLogoPc';
import NavRegions from '../components/Nav_header/NavRegions';
import { useContext } from 'react';
import { Context } from '..';
import MyButtonIcon from '../components/MyButtonIcon';
import icon_edit from '../images/icon-edit.png'

function Personale_page() {

    const {store} = useContext(Context)

    function editData () {

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
                        <div id="list_founders">
                            <h2 style={{fontSize: "20px"}}>
                                Учредитель Родной партии:
                            </h2>
                            <div className="photo_big__wrapper">
                                <img className="photo_big" src={store.user.photo_max} alt="Ваше фото"></img>
                                <div className="personale_p__wrapper">
                                    <h2 style={{fontSize: "18px"}}>
                                        Персональные данные: <MyButtonIcon src={icon_edit} name="edit" func={editData} />
                                    </h2>
                                    <p className="personale_data">Имя: {store.user.first_name}</p>
                                    <p className="personale_data">Фамилия: {store.user.last_name}</p>
                                    <p className="personale_data"><a href={`https://vk.com/id${store.user.vk_id}`}>Страница ВК</a></p>
                                    <h2 style={{fontSize: "18px"}}>
                                        Место жительства:  <MyButtonIcon src={icon_edit} name="edit" func={editData} />
                                    </h2>
                                    <p className="personale_data">Страна: {store.user.residency.country}</p>
                                    <p className="personale_data">Регион: {store.user.residency.region}</p>
                                    <p className="personale_data">Район: {store.user.residency.locality}</p>
                                </div>
                                <h2 style={{fontSize: "18px"}}>
                                    Декларация моей Родной партии:  <MyButtonIcon src={icon_edit} name="edit" func={editData} />
                                </h2>
                            </div>
                            
                        </div>

                        <div className="main__screen-flag">
                        
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

        </div>
    );
    
}

export default observer(Personale_page);