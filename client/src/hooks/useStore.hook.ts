import Store from "../store/store";

const store = new Store();

export const useStore = () => {

    return {
        store,
    };
};
