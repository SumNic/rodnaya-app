import { createContext, RefObject, useContext } from 'react';
import { MessageWebsocketResponse } from '../models/response/MessageWebsocketResponse';

interface GroupContextType {
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	isLoadGroups: boolean;
	setIsLoadGroups: React.Dispatch<React.SetStateAction<boolean>>;
	isLoadingPrevious: boolean;
	setIsLoadingPrevious: React.Dispatch<React.SetStateAction<boolean>>;
	isLoadingNext: boolean;
	setIsLoadingNext: React.Dispatch<React.SetStateAction<boolean>>;
	groupDataSocket: MessageWebsocketResponse | undefined;
	setGroupDataSocket: React.Dispatch<React.SetStateAction<MessageWebsocketResponse | undefined>>;
	isScrollTop: boolean;
	setIsScrollTop: React.Dispatch<React.SetStateAction<boolean>>;
	groupsContainerRef: RefObject<HTMLDivElement>;
}

export const GroupContext = createContext<GroupContextType | null>(null);

export const useGroupContext = () => {
	const groupContext = useContext(GroupContext);

	if (!groupContext) {
		throw new Error('useGroupContext должен быть использован внутри <GroupContext.Provider>');
	}

	return groupContext;
};
