export default class Storage {
  private version: number;

  constructor(opt: { version: number }) {
    this.version = opt.version;
  }

  removeItem(key: string) {
    window.localStorage.removeItem(key);
  }

  getItem<T>(key: string) {
    let json: any = undefined;

    try {
      const raw = window.localStorage.getItem(key);

      if (raw !== null) {
        json = JSON.parse(raw);
      }
    } catch (_) {}

    if (
      typeof json === "object" &&
      typeof json.data !== "undefined" &&
      typeof json.version !== "undefined" &&
      json.version === this.version
    ) {
      return json.data as T;
    }

    this.removeItem(key);

    return undefined;
  }

  setItem(key: string, data: any) {
    window.localStorage.setItem(
      key,
      JSON.stringify({ version: this.version, data })
    );
  }
}
