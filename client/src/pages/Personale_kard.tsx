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
import OnChangeForm from '../components/OnChangeForm';
import HeaderLogoRegistr from '../components/HeaderLogoRegistr';
import EditProfile from '../components/EditProfile';
import Declaration from '../components/Declaration';
import PersonaleData from '../components/PersonaleData';

function Personale_kard() {

    const {store} = useContext(Context)

    const [edit, setEdit] = useState<boolean>(false)
    const [editPersonale, setEditPersonale] = useState<boolean>(false)
    const [editResidency, setEditResidency] = useState<boolean>(false)
    const [editDeclaration, setEditDeclaration] = useState<boolean>(false)
    const [editProfile, setEditProfile] = useState<boolean>(false)
    

    useEffect(() => {
        if (store.cancelAction) {
            setEdit(false)
            setEditPersonale(false)
            setEditResidency(false)
            setEditDeclaration(false)
            setEditProfile(false)
        }
        store.setCancelAction(false)
    })
    

    function editDataPersonale () {
        setEdit(true)
        setEditPersonale(true)
    }

    function editDataResidency () {
        setEdit(true)
        setEditResidency(true)
    }

    function editDataDeclaration () {
        setEdit(true)
        setEditDeclaration(true)
    }

    function editDataProfile () {
        setEdit(true)
        setEditProfile(true)
    }

    const personaleData = 
        <>
            <h2 style={{fontSize: "20px"}}>
                Учредитель Родной партии:
            </h2>
            <div className="photo_big__wrapper">
                <img className="photo_big" src={store.user.photo_max} alt="Ваше фото"></img>
                <div className="personale_p__wrapper" style={{paddingBottom: 0}}>
                    <h2 style={{fontSize: "18px"}}>
                        Персональные данные: <MyButtonIcon src={icon_edit} name="edit" func={editDataPersonale} />
                    </h2>
                    <p className="personale_data">Имя: {store.user.first_name}</p>
                    <p className="personale_data">Фамилия: {store.user.last_name}</p>
                    <p className="personale_data"><a href={`https://vk.com/id${store.user.vk_id}`}>Страница ВК</a></p>
                    <h2 style={{fontSize: "18px"}}>
                        Место жительства:  <MyButtonIcon src={icon_edit} name="edit" func={editDataResidency} />
                    </h2>
                    <p className="personale_data">Страна: {store.user.residency.country}</p>
                    <p className="personale_data">Регион: {store.user.residency.region}</p>
                    <p className="personale_data">Район: {store.user.residency.locality}</p>
                </div>
                <div style={{width: "100%", display: "block"}}>
                    <h2 style={{fontSize: "19px", marginBottom: 0, textAlign: "center"}}>
                        Декларация моей Родной партии:  <MyButtonIcon src={icon_edit} name="edit" func={editDataDeclaration} />
                    </h2>
                </div>                
                <div style={{width: "100%"}}>
                    <p className="personale_data" style={{whiteSpace: 'pre'}}>{store.user.declaration?.declaration}</p>
                </div>
                
                <h2 style={{fontSize: "19px"}}>
                    Управление профилем:  <MyButtonIcon src={icon_edit} name="edit" func={editDataProfile} />
                </h2>
            </div>
        </>
        
    

    return (
        <div>
            <header className="header">
                <div className="header__wrapper">
                    <HeaderLogoMobile />
                    <HeaderLogoRegistr />
                </div>
            </header>

            <div className="middle">
                <div className="middle__wrapper">
                    <NavMiddle />
                    <div className="main__screen main__screen_home">
                        <div id="list_founders">
                            {!edit && personaleData}
                            {!store.cancelAction && editPersonale && <PersonaleData />}
                            {!store.cancelAction && editResidency && <OnChangeForm  id={store.user.id} secret={store.user.secret.secret}/>}
                            {!store.cancelAction && editProfile && <EditProfile />}
                            {!store.cancelAction && editDeclaration && <Declaration />}
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

export default observer(Personale_kard);