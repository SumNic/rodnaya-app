import { useEffect, useState } from 'react';
import { useUploadForm } from '../hooks/useUploadForm';
// import { Context } from '..';
import { useStoreContext } from '../contexts/StoreContext';

interface IState {
  file: File | undefined;
}

const initialState: IState = {
  file: undefined
}

export default function UploadAvatar() {

    // const {store} = useContext(Context)
    const { store } = useStoreContext();

    const { uploadForm } = useUploadForm('/upload-avatar');

    const [state, setState] = useState<IState>(initialState);
    // const [nameFile, setNameFile] = useState<string>('');
    // const [isError, setIsError] = useState<string>('');
    // const [isSuccess, setIsSuccess] = useState<boolean>(false);

    // console.log(isLoading, nameFile, isError, isSuccess, 'isLoading, nameFile, isError, isSuccess');

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const file = event.target.files?.[0];

        setState({ ...state, file });
    };

    useEffect(() => {
        uploadFile()
    }, [state])

    const uploadFile = async () => {
        // setIsError('')
        // setIsSuccess(false)

        if (!state.file) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', state.file); // fileInput is the input element where you get the file
            formData.append('userId', `${store.user.id}`);
            // setNameFile(state.file.name)
            const response = await uploadForm(formData)

            if(response.data.error) {
                // setIsError(response.data.error.message)
                return
            }
            // setIsSuccess(true)
            store.setUser(response.data)

        } catch (error: any) {
            console.log(error, 'Ошибка в uploadFile');
            // setIsError(error.message)
        }
    };

    // const style = isLoading ? {display: "block"} : {display: "none"}

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