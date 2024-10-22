import { observer } from 'mobx-react-lite';
import MyButton from './MyButton';
import { useStoreContext } from '../contexts/StoreContext';

function EditProfile () {

    // const {store} = useContext(Context)
    const { store } = useStoreContext();

    function deleteProfile() {
        store.deleteProfile(store.user.id, store.user.secret)
    }

    function cancel() {
        store.setRegistrationEnd(false)
        store.setCancelAction(true) // закрывается окно редактирования в Personale_page
    }

    return (
        <>
            <h2 style={{fontSize: "20px"}}>
                Удалить мой профиль с сайта Родная партия:
            </h2>
            <div style={{display: "flex"}}>
                <MyButton text="Удалить" func={deleteProfile}/><MyButton text="Отменить" func={cancel} style={{background: "#bbbb50"}}/>
            </div>
        </>
        
    );
}

export default observer(EditProfile);