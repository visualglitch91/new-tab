export default class ListenerGroup {
  private unsubscribers: Function[] = [];

  with<
    T extends {
      addEventListener: (...args: any[]) => void;
      removeEventListener: (...args: any[]) => void;
    }
  >(obj: T): { subscribe: T["addEventListener"] } {
    return {
      subscribe: (name, handler) => {
        obj.addEventListener(name, handler);
        this.addUnsubscribe(() => obj.removeEventListener(name, handler));
      },
    };
  }

  addUnsubscribe(func: () => void) {
    this.unsubscribers.push(func);
  }

  unsubscribeAll() {
    this.unsubscribers.forEach((it) => it());
    this.unsubscribers = [];
  }
}
