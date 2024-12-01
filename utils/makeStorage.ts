class StorageHelper {
  setItem(key: string, value: any): void {
    if (import.meta.client) {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  getItem<T>(key: string): T | null {
    if (import.meta.client) {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    }
    return null
  }

  removeItem(key: string): void {
    if (import.meta.client) {
      localStorage.removeItem(key)
    }
  }
}

export default () => new StorageHelper()
