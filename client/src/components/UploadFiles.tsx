import { useContext, useEffect, useState } from 'react';
import { useUploadForm } from '../hooks/useUploadForm';
import { Context } from '..';
import del_new from '../images/del_new.png';
import save_new from '../images/save_new.png';

interface IState {
  file: File | undefined;
}

const initialState: IState = {
  file: undefined
}

export default function UploadFiles() {

    const {store} = useContext(Context)

    const { isLoading, uploadForm, progress } = useUploadForm('/upload-files');

    const [state, setState] = useState<IState>(initialState);
    const [nameFile, setNameFile] = useState<string>('');
    const [isError, setIsError] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    // store.setProgressLoadValue(progress)

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const file = event.target.files?.[0];

        setState({ ...state, file });
    };

    useEffect(() => {
        uploadFile()
    }, [state])

    const uploadFile = async () => {
        setIsError('')
        setIsSuccess(false)

        if (!state.file) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', state.file); // fileInput is the input element where you get the file
            setNameFile(state.file.name)
            const response = await uploadForm(formData)
            console.log(response);

            if(response.data.error) {
                setIsError(response.data.error.message)
                return
            }
            setIsSuccess(true)

        } catch (error: any) {
            console.error(error, 'error');
            setIsError(error.message)
        }
    };

    const style = isLoading ? {display: "flex"} : {display: "none"}


    return (
        <>
            <div id="show_clip" style={style}>
                <p id="progress_start">{state.file?.name}</p>
                {progress < 100 && <progress value={progress} max={100} />}
                {isError && 
                    <>
                        <img src={del_new} id='progress_end'></img>
                        <p id="progress_start" style={{color:'red'}}>{isError}</p>
                    </>                   
                }
                {isSuccess && <img src={save_new} id='progress_end'></img>}
            </div>
            <form name="load_message" id="load_message">
                <div className="clip">
                    <div className="label-clip">
                        <label htmlFor="fileToUpload">
                            <input 
                                type="file" 
                                id="fileToUpload" 
                                name="fileToUpload" 
                                defaultValue="" 
                                style={{display: "none"}}  
                                onChange={handleChange} 
                            />
                        </label>
                    </div>
                </div>
            </form>
        </>
        
    );
}