import { useEffect, useState } from 'react';
import { useUploadForm } from '../hooks/useUploadForm';
// import { Context } from '..';
import del_new from '../images/del_new.png';
import save_new from '../images/save_new.png';
import {Buffer} from 'buffer';
import MyButtonIcon from './MyButtonIcon';
import { useStoreContext } from '../contexts/StoreContext';

interface IState {
  file: File | undefined;
}

const initialState: IState = {
  file: undefined
}

export default function UploadFiles() {

    // const {store} = useContext(Context)
    const { store } = useStoreContext();

    const { isLoading, uploadForm, progress } = useUploadForm('/upload-files');

    const [state, setState] = useState<IState>(initialState);
    const [nameFile, setNameFile] = useState<string>('');
    const [isError, setIsError] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

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

            if(response.data.error) {
                setIsError(response.data.error.message)
                return
            }
            setIsSuccess(true)
            store.setFiles(response.data)

        } catch (error: any) {
            setIsError(error.message)
        }
    };

    const style = isLoading ? {display: "block"} : {display: "none"}

    return (
        <>
            <div id="show_clip" style={style}>
                {store.files && store.files.map((files: any, index: number) => {
                    let originFileName = Buffer.from(files.fileName, 'latin1').toString('utf8')
                    return (
                        <div key={index} style={{display: 'flex', paddingBottom: '5px'}}>
                            <p id="progress_start">{originFileName}</p>
                            <img src={save_new} id='progress_end'></img>
                        </div>
                    )})
                }
                {progress < 100 && 
                    <div style={{display: 'flex', paddingBottom: '5px'}}>
                        <p id="progress_start">{state.file?.name}</p>
                        <progress value={progress} max={100} />
                    </div>}
                {isError && 
                    <div style={{display: 'flex', paddingBottom: '5px'}}>
                        <p id="progress_start">{state.file?.name}</p>
                        <MyButtonIcon nameDiv="edit" id="progress_end" src={del_new} func={() => setIsError('')} />
                        <p id="progress_start" style={{color:'red'}}>{isError}</p>
                    </div>                   
                }
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