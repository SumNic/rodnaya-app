import { useEffect, useState } from 'react';
import { useUploadForm } from '../hooks/useUploadForm';
import del_new from '../images/del_new.png';
import save_new from '../images/save_new.png';
import { Buffer } from 'buffer';
import MyButtonIcon from './MyButtonIcon';
import { useStoreContext } from '../contexts/StoreContext';

interface IState {
	file: File | undefined;
}

const initialState: IState = {
	file: undefined,
};

function UploadFiles() {
	const [state, setState] = useState<IState>(initialState);
	const [isError, setIsError] = useState<string>('');

	const { store } = useStoreContext();

	const { isLoading, uploadForm, progress } = useUploadForm('/upload-files');

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		const file = event.target.files?.[0];

		setState({ ...state, file });
	};

	useEffect(() => {
		uploadFile();
	}, [state]);

	const uploadFile = async () => {
		setIsError('');

		if (!state.file) {
			return;
		}

		try {
			const formData = new FormData();
			formData.append('file', state.file);
			const response = await uploadForm(formData);
			store.filesStore.setFiles(response?.data);
		} catch (error: any) {
			if (error.response.data.message) {
				setIsError(error.response.data.message);
			}
			console.error(`Ошибка в UploadFiles: ${error}`);
		}
	};

	const style = isLoading ? { display: 'block' } : { display: 'none' };

	return (
		<>
			<div id="show_clip" style={style}>
				{store.filesStore.files &&
					store.filesStore.files.map((files: any, index: number) => {
						let originFileName = Buffer.from(files.fileName, 'latin1').toString('utf8');
						return (
							<div key={index} style={{ display: 'flex', paddingBottom: '5px' }}>
								<p id="progress_start">{originFileName}</p>
								<img src={save_new} id="progress_end"></img>
							</div>
						);
					})}
				{!isError && state.file?.name && progress < 100 && (
					<div style={{ display: 'flex', paddingBottom: '5px' }}>
						<p id="progress_start">{state.file?.name}</p>
						<progress value={progress} max={100} />
					</div>
				)}
				{isError && state.file?.name && (
					<div style={{ display: 'flex', paddingBottom: '5px' }}>
						<p id="progress_start">{state.file?.name}</p>
						<MyButtonIcon
							nameDiv="edit"
							id="progress_end"
							src={del_new}
							func={() => {
								setState({ file: undefined });
								setIsError('');
							}}
						/>
						<p id="progress_start" style={{ color: 'red' }}>
							{isError}
						</p>
					</div>
				)}
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
								style={{ display: 'none' }}
								onChange={handleChange}
							/>
						</label>
					</div>
				</div>
			</form>
		</>
	);
}

export default UploadFiles;
