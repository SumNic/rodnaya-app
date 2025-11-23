import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
	import.meta.env.DEV ? (
		<App />
	) : (
		<React.StrictMode>
			<App />
		</React.StrictMode>
	)
);
