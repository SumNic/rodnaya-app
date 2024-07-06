import { observer } from 'mobx-react-lite';
import Footer from '../components/Footer';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../components/HeaderLogo/HeaderLogoMobile';
// import HeaderLogoPc from '../components/HeaderLogoPc';
// import { Context } from '..';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import { useStoreContext } from '../contexts/StoreContext';

function Personale_kard() {

    // const {store} = useContext(Context)
    const { store } = useStoreContext();

    // const [edit, setEdit] = useState<boolean>(false)
    // const [editPersonale, setEditPersonale] = useState<boolean>(false)
    // const [editResidency, setEditResidency] = useState<boolean>(false)
    // const [editDeclaration, setEditDeclaration] = useState<boolean>(false)
    // const [editProfile, setEditProfile] = useState<boolean>(false)
    

    // useEffect(() => {
    //     if (store.cancelAction) {
    //         setEdit(false)
    //         setEditPersonale(false)
    //         setEditResidency(false)
    //         setEditDeclaration(false)
    //         setEditProfile(false)
    //     }
    //     store.setCancelAction(false)
    // })

    const personaleData = 
        <>
            <h2 style={{fontSize: "20px"}}>
                Учредитель Родной партии:
            </h2>
            <div className="photo_big__wrapper">
                <img className="photo_big" src={store.user.photo_max} alt="Ваше фото"></img>
                <div className="personale_p__wrapper" style={{paddingBottom: 0}}>
                    <h2 style={{fontSize: "18px"}}>
                        Персональные данные:
                    </h2>
                    <p className="personale_data">Имя: {store.user.first_name}</p>
                    <p className="personale_data">Фамилия: {store.user.last_name}</p>
                    <p className="personale_data"><a href={`https://vk.com/id${store.user.vk_id}`}>Страница ВК</a></p>
                    <h2 style={{fontSize: "18px"}}>
                        Место жительства:
                    </h2>
                    <p className="personale_data">Страна: {store.user.residency.country}</p>
                    <p className="personale_data">Регион: {store.user.residency.region}</p>
                    <p className="personale_data">Район: {store.user.residency.locality}</p>
                </div>
                <div style={{width: "100%", display: "block"}}>
                    <h2 style={{fontSize: "19px", marginBottom: 0, textAlign: "center"}}>
                        Декларация моей Родной партии:
                    </h2>
                </div>                
                <div style={{width: "100%"}}>
                    <p className="personale_data" style={{whiteSpace: 'pre'}}>{store.user.declaration?.declaration}</p>
                </div>
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
                            {personaleData}
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