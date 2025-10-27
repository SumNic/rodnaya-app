import AuthStore from './AuthStore';
import FilesStore from './FilesStore';
import GroupStore from './GroupStore';
import LocationStore from './LocationStore';
import MessageStore from './MessageStore';
import PublicationStore from './PublicationStore';

class RootStore {
	authStore: AuthStore;
	messageStore: MessageStore;
	publicationStore: PublicationStore;
	locationStore: LocationStore;
	filesStore: FilesStore;
	groupStore: GroupStore;

	constructor() {
		this.authStore = new AuthStore();
		this.messageStore = new MessageStore();
		this.publicationStore = new PublicationStore();
		this.locationStore = new LocationStore();
		this.filesStore = new FilesStore();
		this.groupStore = new GroupStore();
	}
}

const store = new RootStore();

export default store;
