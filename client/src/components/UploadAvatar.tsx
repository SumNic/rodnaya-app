import { useEffect, useState } from 'react';
import { useUploadForm } from '../hooks/useUploadForm';
import { useStoreContext } from '../contexts/StoreContext';
import { message } from 'antd';

interface IState {
  file: File | undefined;
}

const initialState: IState = {
  file: undefined
}

export default function UploadAvatar() {
    const { store } = useStoreContext();

    const { uploadForm } = useUploadForm('/upload-avatar');

    const [state, setState] = useState<IState>(initialState);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const file = event.target.files?.[0];

        if (file) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
    
            img.onload = () => {
                if (img.width === img.height) {
                    setState({ ...state, file });
                } else {
                    message.error("Пожалуйста, загрузите изображение с равными сторонами (квадратное).");
                    // Очищаем input, если изображение не подходит
                    event.target.value = '';
                }
            };
    
            img.onerror = () => {
                console.error("Ошибка при загрузке изображения.");
            };
        }
    };

    useEffect(() => {
        uploadFile()
    }, [state])

    const uploadFile = async () => {

        if (!state.file) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', state.file);
            formData.append('userId', `${store.authStore.user.id}`);
            const response = await uploadForm(formData)

            if(response.data.error)  return
            
            store.authStore.setUser(response.data)

        } catch (error: any) {
            console.log(error, 'Ошибка в uploadFile');
        }
    };

    return (
        <form name="load_message" id="load_message">
            <label htmlFor="avatarToUpload">
                <input 
                    type="file" 
                    id="avatarToUpload" 
                    name="avatarToUpload" 
                    defaultValue="" 
                    style={{display: "none"}}  
                    onChange={handleChange} 
                />
            </label>
        </form>
    );
}