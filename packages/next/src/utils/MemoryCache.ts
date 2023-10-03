export default class MemoryCache<T> {
  private cache = new Map<string, T>();
  private timeouts = new Map<string, number>();
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
      window.setTimeout(() => {
        this.onDispose?.(value);
        this.cache.delete(key);
      }, this.ttl)
    );
  }

  has(key: string) {
    return this.cache.has(key);
  }

  get(key: string) {
    return this.cache.get(key);
  }
}
