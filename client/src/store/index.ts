import AuthStore from './AuthStore';
import CommonStore from './CommonStore';
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
	commonStore: CommonStore;

	constructor() {
		this.authStore = new AuthStore();
		this.messageStore = new MessageStore();
		this.publicationStore = new PublicationStore();
		this.locationStore = new LocationStore();
		this.filesStore = new FilesStore();
		this.groupStore = new GroupStore();
		this.commonStore = new CommonStore();
	}
}

const store = new RootStore();

export default store;
