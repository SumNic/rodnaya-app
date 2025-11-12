import React, { useEffect, useRef, useState } from 'react';
import { useStoreContext } from '../../contexts/StoreContext';
import { Upload, UploadFile, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import styles from './UploadAntdFiles.module.css';
import { observer } from 'mobx-react-lite';

interface UploadFilesProp {
	isHiddenButton?: boolean;
	uploadRef?: React.MutableRefObject<any>;
	width?: number;
}

const UploadAntdFiles: React.FC<UploadFilesProp> = ({ isHiddenButton = false, uploadRef, width }) => {
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const { store } = useStoreContext();

	const innerUploadRef = useRef<any>(null);
	const divRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (uploadRef) uploadRef.current = innerUploadRef.current;
	}, [uploadRef]);

	useEffect(() => {
		if (store.filesStore.files.length === 0) setFileList([]);
	}, [store.filesStore.files]);

	const beforeUpload = (file: File) => {
		if (file.size > 20 * 1024 * 1024) {
			message.warning('Файл должен быть меньше 20MB!');
			return Upload.LIST_IGNORE;
		}
		return true;
	};

	const customRequest = async (options: any) => {
		const { file, onSuccess, onError } = options;

		const result = await store.filesStore.uploadFile('/upload-files', file);

		if (result.error) {
			onError(result.error.message);
			message.error(result.error.message);
		} else {
			setFileList([...fileList, file]);
			onSuccess(result.data);
		}
	};

	const onRemove = (file: UploadFile) => {
		const newStoreFiles = store.filesStore.files.filter((item) => item.fileName !== file.name);
		store.filesStore.createFiles(newStoreFiles);

		const newFileList = fileList.filter((item) => item.uid !== file.uid);
		setFileList(newFileList);
	};

	return (
		<div className={styles.uploadContainer} ref={divRef}>
			<Upload
				ref={innerUploadRef}
				fileList={fileList}
				onChange={({ fileList }) => setFileList(fileList)}
				customRequest={customRequest}
				beforeUpload={beforeUpload}
				accept=".jpg,.png,.jpeg,.pdf,.doc,.rtf,.odt"
				onRemove={onRemove}
				maxCount={10}
				itemRender={(originNode: React.ReactNode) => (
					<div className={styles['file-name-container']}>
						<span className={styles['file-name']} style={{ maxWidth: width ? `${width - 70}px` : '300px' }}>
							{originNode}
						</span>
					</div>
				)}
			>
				{!isHiddenButton && (
					<Button icon={<UploadOutlined />} loading={store.filesStore.isLoading}>
						Добавить файл
					</Button>
				)}
			</Upload>
		</div>
	);
};

export default observer(UploadAntdFiles);
