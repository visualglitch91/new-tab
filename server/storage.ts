import JSONdb from "simple-json-db";

export default class Storage<T extends { id: string }> {
  private db: JSONdb;

  constructor(name: string) {
    this.db = new JSONdb(`${__dirname}/db/${name}.json`);
  }

  save(item: T) {
    return this.db.set(item.id, item);
  }

  get(id: string): T | undefined {
    return this.db.get(id);
  }

  getAll(): T[] {
    return Object.values(this.db.JSON() || {});
  }

  count() {
    return this.getAll().length;
  }

  remove(id: string) {
    return this.db.delete(id);
  }
}
