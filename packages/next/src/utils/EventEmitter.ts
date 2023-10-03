export default class EventEmitter {
  private handlers: Map<string, Set<(payload: any) => void>> = new Map();

  emit(name: string, payload: any) {
    this.handlers.get(name)?.forEach((handler) => {
      handler(payload);
    });
  }

  on(name: string, handler: (payload: any) => void) {
    if (!this.handlers.has(name)) {
      this.handlers.set(name, new Set());
    }

    this.handlers.get(name)?.add(handler);

    return () => {
      this.off(name, handler);
    };
  }

  off(name: string, handler: (payload: any) => void) {
    this.handlers.get(name)?.delete(handler);
  }
}
