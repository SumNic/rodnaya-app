import { createContext, useContext } from 'react';
import Store from '../store/store';

export interface StoreContextType {
	store: Store;
}

export const StoreContext = createContext<StoreContextType | null>(null);

export const useStoreContext = () => {
	const storeContext = useContext(StoreContext);

	if (!storeContext) {
		throw new Error('useStoreContext должен быть использован внутри <StoreContext.Provider>');
	}

	return storeContext;
};
