import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import MyButton from './MyButton';

function PersonaleData () {

    const {store} = useContext(Context)

    async function handleSubmit(e: any) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    
    await store.udatePersonaleData(store.user.secret.secret, formJson)
    store.setCancelAction(true) // закрывается окно редактирования в Personale_page
  }

    function cancel() {
        store.setRegistrationEnd(false)
        store.setCancelAction(true) // закрывается окно редактирования в Personale_page
    }

    return (
        <form method="post" onSubmit={handleSubmit}>
            <input type="hidden" name="user_id" value={store.user.id}/>
            <div>
                <label htmlFor="first_name">
                    <h2 style={{fontSize: "20px", textAlign: "center"}}>
                        Укажите ваше имя:
                    </h2>
                </label>
                <input type="text" name="first_name" id="first_name" placeholder={store.user.first_name}  required/>
            </div>
            <div>
                <label htmlFor="last_name">
                    <h2 style={{fontSize: "20px", textAlign: "center"}}>
                        Укажите вашу фамилию:
                    </h2>
                </label>
                <input type="text" name="last_name" id="last_name" placeholder={store.user.last_name}  required/>
            </div>
            <div style={{display: "flex"}}>
                <MyButton type="submit" text="Сохранить" /><MyButton type="reset" text="Отменить"  style={{background: "#bbbb50"}} func={cancel} />
            </div>
        </form>
        
    );
}

export default observer(PersonaleData);