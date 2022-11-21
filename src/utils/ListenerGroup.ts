export default class ListenerGroup {
  private unsubscribers: Function[] = [];

  subscribe<T extends HTMLElement, K extends keyof HTMLElementEventMap>(
    element: T,
    name: K,
    handler: (e: HTMLElementEventMap[K]) => void
  ) {
    element.addEventListener(name, handler);

    this.unsubscribers.push(() => {
      element.removeEventListener(name, handler);
    });
  }

  unsubscribeAll() {
    this.unsubscribers.forEach((it) => it());
    this.unsubscribers = [];
  }
}
