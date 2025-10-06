export const session = {
    get<T>(key: string): T | null {
        const raw = sessionStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    },
    set<T>(key: string, value: T) {
        sessionStorage.setItem(key, JSON.stringify(value));
    },
    remove(key: string) {
        sessionStorage.removeItem(key);
    },
};
export const local = {
    get<T>(key: string): T | null {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    },
    set<T>(key: string, value: T) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key: string) {
        localStorage.removeItem(key);
    },
};