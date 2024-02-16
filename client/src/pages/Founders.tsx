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

function Founders() {

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
                            <div className="scroll_bar">
                                <ul className="ul_founders">
                                    <h2 className="name__local_founders" id="name">'.$user['country'].'</h2>
                                    <ul className="ul_founders">
                                        <p className="header__link_founders">'.$user2['region'].'</p>
                                        <li>
                                            <div className="mes__wrapper_founders">
                                                <a href="https://vk.com/id'.$vk_id.'"><img className="mes_foto" src="' . $user3['photo_50'] . '"></img></a>
                                                <div className="name__first_last_founders">
                                                    <a href="https://vk.com/id'.$vk_id.'" className="name__first"><p className="name__first">' . $user3['first_name'] . '</p></a>
                                                    <a href="https://vk.com/id'.$vk_id.'" className="name__first"><p className="name__first">' . $user3['last_name'] . '</p></a>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </ul>
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

export default Founders;