import ReactDOM from 'react-dom/client';
import App from './App';
import React from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
	import.meta.env.DEV 
		? <App /> 
		: (
			<React.StrictMode>
				<App />
			</React.StrictMode>
		)
);
