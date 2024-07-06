import { useState } from 'react';
import Footer from '../components/Footer';
import HeaderLogoMobile from '../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import MyButton from '../components/MyButton';
import { useStoreContext } from '../contexts/StoreContext';
import { EXIT_ROUTE } from '../utils/consts';
// import { Context } from '..';

function Exit () {

    // const {store} = useContext(Context)
    const { store } = useStoreContext();

    const [checked, setChecked] = useState(false);

    function handleChange(event: any) {
        setChecked(event.target.checked);
    }

    function logout() {
        store.logout(checked)
    }

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
                    <NavMiddle item={EXIT_ROUTE}/>
                    <div className="main__screen main__screen_home">
                        <div id="list_founders">
                            <input type="checkbox" checked={checked} onChange={handleChange} id="exit" />
                            <label htmlFor="exit" className="personale_h2" style={{fontSize: "20px", padding: "10px", display: "inline-block"}}>
                                - выйти со всех устройств?
                            </label>
                            <MyButton text="Выйти" func={logout}/>
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

export default Exit;