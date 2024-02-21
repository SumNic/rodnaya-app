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
import { IUser } from '../models/IUser';
import HeaderLogoRegistr from '../components/HeaderLogoRegistr';

function Founders() {

    const {store} = useContext(Context)

    useEffect(() => {
            store.getAllResidencys()
    }, [store])

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
                            <div className="scroll_bar">
                                {store.isResidency
                                    .map( (item: any) => item.users.length !== 0 && item.country)
                                    .filter((item, index, arr) => arr.indexOf(item) === index)
                                    .map( (item_country: any, index: any) =>
                                    <ul key={index} className="ul_founders">
                                        <h2 className="name__local_founders" id="name">{item_country}</h2>
                                        {store.isResidency
                                            .map( (item: any) => item.users.length !== 0  && item.country === item_country && item.region)
                                            .filter((item, index, arr) => arr.indexOf(item) === index)
                                            .map( (item_region: any, index: any) =>
                                            <ul key={index} className="ul_founders">
                                                <h2 className="name__local_founders" id="name">{item_region}</h2>
                                                {store.isResidency
                                                .map( (item: any) =>
                                                    item.country === item_country && item.region === item_region &&
                                                    item.users.map( (user: IUser, index: any) =>
                                                        <li key={index}>
                                                            <div className="mes__wrapper_founders">
                                                                <a href=""><img className="mes_foto" src={user.photo_50} alt={user.photo_50}></img></a>
                                                                <div className="name__first_last_founders">
                                                                    <a href="" className="name__first"><p className="name__first">{user.first_name}</p></a>
                                                                    <a href="" className="name__first"><p className="name__first">{user.last_name}</p></a>
                                                                </div>
                                                            </div>
                                                        </li>)
                                                    )}
                                            </ul>)
                                        }
                                    </ul>)
                                }
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

export default observer(Founders);
// export default Founders;