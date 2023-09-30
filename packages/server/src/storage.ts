import JSONdb from "simple-json-db";

export default class Storage<T extends { id: string }> {
  private db: JSONdb;

  constructor(name: string) {
    this.db = new JSONdb(`${__dirname}/${name}.db.json`);
  }

  save(item: T) {
    return this.db.set(item.id, item);
  }

  get(id: string): T {
    return this.db.get(id);
  }

  getAll(): T[] {
    return Object.values(this.db.JSON() || {});
  }

  remove(id: string) {
    return this.db.delete(id);
  }
}
