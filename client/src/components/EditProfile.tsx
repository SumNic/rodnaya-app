import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import MyButton from './MyButton';

function EditProfile () {

    const {store} = useContext(Context)

    function deleteProfile() {
        store.deleteProfile(store.user.id, store.user.secret.secret)
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