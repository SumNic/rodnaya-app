import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoLoad from '../components/LogoLoad/LogoLoad';
import { useStoreContext } from '../contexts/StoreContext';

const VkCallback: React.FC = () => {
	const { store } = useStoreContext();
	const navigate = useNavigate();

	const location = useLocation();

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const codeFromUrl = queryParams.get('payload');
		if (codeFromUrl) {
			const payload = JSON.parse(codeFromUrl);
			store.authStore.registration(payload, navigate);
		} else {
			store.authStore.setError(true);
			store.authStore.setMessageError('Ошибка в VkCallback');
		}
	}, []);

	return (
		<div>
			<LogoLoad />
		</div>
	);
};

export default VkCallback;
