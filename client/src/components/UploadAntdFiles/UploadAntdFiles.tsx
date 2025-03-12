import { useUploadForm } from '../../hooks/useUploadForm';
import { useStoreContext } from '../../contexts/StoreContext';
import { Button, message, Upload, UploadFile } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import styles from './UploadAntdFiles.module.css';
import { useThemeContext } from '../../contexts/ThemeContext';

function UploadAntdFiles() {
	const { store } = useStoreContext();

	const { currentWidth } = useThemeContext();

	const { uploadForm } = useUploadForm('/upload-files');

	const uploadFile = async (options: any) => {
		const { file, onSuccess, onError } = options;

		try {
			const formData = new FormData();
			formData.append('file', file);
			const response = await uploadForm(formData);
			if (response.status === 201) {
				store.filesStore.setFiles(response.data);
				onSuccess(response.data);
			}
		} catch (error: any) {
			onError(error);
			console.error(`Ошибка в UploadFiles: ${error}`);
		}
	};

	const removeFile = (file: UploadFile) => {
		const newStoreFiles = store.filesStore.files.filter((item) => item.fileName !== file.originFileObj?.name);
		store.filesStore.createFiles(newStoreFiles);
	}

	return (
		<>
			<Upload
				customRequest={uploadFile}
				beforeUpload={(file) => {
					if (file.size > 20 * 1024 * 1024) {
						message.warning('Файл должен быть меньше 20MB!');
						return false;
					}
					return true;
				}}
				accept=".jpg, .png, .jpeg, .pdf, .doc, .rtf, .odt"
				itemRender={(originNode: React.ReactNode) => (
					<div className={styles['file-name-container']}>
						<span
							className={styles['file-name']}
							style={{ maxWidth: currentWidth ? `${currentWidth - 30}px` : '300px' }}
						>
							{originNode}
						</span>
					</div>
				)}
				onRemove={removeFile}
			>
				<Button icon={<UploadOutlined />}></Button>
			</Upload>
		</>
	);
}

export default UploadAntdFiles;
