const store = {
    get(key: string, defaultValue: any = undefined) {
        const value = window.localStorage.getItem(key);

        return value ? value : defaultValue;
    },
    set(key: string, value: any) {
        window.localStorage.setItem(key, value);
    }
};

export default store;