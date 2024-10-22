import React from 'react';

const Blocked: React.FC = () => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100vh',
				justifyContent: 'center',
				alignItems: 'center',
                fontSize: '25px'
			}}
		>
			Ваша страница заблокирована
		</div>
	);
};

export default Blocked;
