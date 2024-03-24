export class MemoryCache<T> {
  private cache = new Map<string, T>();
  private timeouts = new Map<string, NodeJS.Timeout>();
  private ttl: number;
  private onDispose?: (value: T) => void;

  constructor({
    ttl,
    onDispose,
  }: {
    ttl: number;
    onDispose?: (value: T) => void;
  }) {
    this.ttl = ttl;
    this.onDispose = onDispose;
  }

  set(key: string, value: T) {
    this.cache.set(key, value);

    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
    }

    this.timeouts.set(
      key,
      setTimeout(() => this.remove(key), this.ttl)
    );
  }

  remove(key: string) {
    if (this.cache.has(key)) {
      this.onDispose?.(this.cache.get(key)!);
      this.cache.delete(key);
    }

    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key));
    }
  }

  has(key: string) {
    return this.cache.has(key);
  }

  get(key: string) {
    return this.cache.get(key);
  }

  getKeys() {
    return Array.from(this.cache.keys());
  }
}
