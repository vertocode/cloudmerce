class StorageHelper {
    setItem(key: string, value: any): void {
        if (process.client) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

    getItem<T>(key: string): T | null {
        if (process.client) {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        return null;
    }

    removeItem(key: string): void {
        if (process.client) {
            localStorage.removeItem(key);
        }
    }
}

export default () => new StorageHelper()
