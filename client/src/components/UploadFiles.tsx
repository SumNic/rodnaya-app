import { useEffect, useState } from 'react';
import icon_attach from '../images/clippy-icon1.png'
import FilesService from '../services/FilesService';

interface Props {
    text: string;
    style?: any;
    type?: "button" | "submit" | "reset" | undefined;
    func?: () => void;
  }

interface IFileUploadProps {}

interface IState {
  file: File | undefined;
}

const initialState: IState = {
  file: undefined
}

function UploadFiles() {

    const [state, setState] = useState<IState>(initialState);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const file = event.target.files?.[0];

        setState({ ...state, file });
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
            formData.append('file', state.file); // fileInput is the input element where you get the file
            const response = await FilesService.uploadFile(formData)
            // const response = await fetch('http://localhost:5000/upload', {
            // method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         file: state.file
            //     }),
            // });

        // const data = await response.json();

        console.log(response);

        } catch (error) {
            console.error(error);
        }
    }; 


    return (
        <form name="load_message" id="load_message">
            <div className="clip">
                <div className="label-clip">
                    <label htmlFor="fileToUpload">
                        <img src={icon_attach} alt="Прикрепить" className="clippy-icon" />
                        <input type="file" id="fileToUpload" name="fileToUpload" defaultValue="" style={{display: "none"}}  onChange={handleChange} />
                    </label>
                </div>
            </div>
        </form>
    );
}

export default UploadFiles;