const store = {
    get(key: string, defaultValue: any) {
        const value = window.sessionStorage.getItem(key);

        return value ? value : defaultValue;
    },
    set(key: string, value: any) {
        window.sessionStorage.setItem(key, value);
    }
};

export default function useSorage(name: string) {
    const get = () => window.sessionStorage.getItem(name);
    const set = (value: string | null) => window.sessionStorage.setItem(name, value);

    return { 
        get,
        set,
    };
}