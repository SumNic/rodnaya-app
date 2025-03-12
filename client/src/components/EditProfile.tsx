import { observer } from 'mobx-react-lite';
import { useStoreContext } from '../contexts/StoreContext';
import { Button, Typography } from 'antd';

const { Title } = Typography;

function EditProfile () {

    // const {store} = useContext(Context)
    const { store } = useStoreContext();

    const deleteCurrentProfile = async () => {
        try {
            await store.authStore.deleteProfile(store.authStore.user.id, store.authStore.user.secret)
        } catch (error) {
            `Ошибка в deleteProfile: ${error}`
        }
    };

    const cancel = () => {
        store.authStore.setRegistrationEnd(false)
        store.authStore.setIsEditProfile(false) // закрывается окно редактирования в Personale_page
    }

    return (
        <>
            <Title level={2} style={{ fontSize: '18px' }}>
                Удалить профиль с сайта Родная партия:
			</Title>
            <div style={{display: "flex", justifyContent: 'end', gap: '10px'}}>
                <Button onClick={cancel}>Отменить</Button>
                <Button type="primary" onClick={deleteCurrentProfile} danger>Удалить</Button>
            </div>
        </>
        
    );
}

export default observer(EditProfile);