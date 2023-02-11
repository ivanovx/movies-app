const store = {
    get(key, defaultValue = undefined) {
        const value = window.localStorage.getItem(key);

        return value ? value : defaultValue;
    },
    set(key, value) {
        window.localStorage.setItem(key, value);
    }
};

export default store;