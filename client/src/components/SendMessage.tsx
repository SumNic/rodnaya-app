import { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import MyButton from './MyButton';
import MessagesService from '../services/MessagesService';
import { IFiles } from '../models/IFiles';

interface Props {
  location: string;
}

function SendMessage (props: Props) {

    const {store} = useContext(Context)

    const [message, setMessage] = useState<string>('')
    const [endPost, setEndPost] = useState<number>(0)

    useEffect(() => {
        setMessage('')
        store.resetFiles()
    }, [props.location])

    async function sendMessage(e: any) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        
        const formData = new FormData(form);
        
        const arrIdFiles = store.files.map((file: IFiles) => file.id)
        formData.append('files', JSON.stringify(arrIdFiles))

        const formJson = Object.fromEntries(formData.entries())
        
        const resp_id = await store.sendMessage(store.user.id, store.user.secret.secret, props.location, formJson)
        setEndPost(+resp_id)

        setMessage('')
        store.setNewMessage(true)
        store.resetFiles()
    }

    return (
        <form name="send_message" id="send_message" method="post" onSubmit={sendMessage}>
            <div className="message">
                <textarea 
                    id="message" 
                    name="message" 
                    placeholder="Введите сообщение" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
            </div>
            <div className="class_none">
                <p id="clip_files"></p>
            </div>
            <div className="send">
                <button type="submit" className="submit-send"></button>
            </div>
        </form>
    );
}

export default observer(SendMessage);