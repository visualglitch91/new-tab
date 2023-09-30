import path from "path";
import { promises as fs } from "fs";
import { PackageTrackerItem } from "@home-control/types/package-tracker";

const filepath = path.resolve(path.join(__dirname, "/data.json"));

function write(packages: PackageTrackerItem[]) {
  return fs.writeFile(filepath, JSON.stringify(packages, null, 2));
}

async function read() {
  try {
    const raw = (await fs.readFile(filepath)).toString();
    return JSON.parse(raw) as PackageTrackerItem[];
  } catch (_) {
    return [];
  }
}

async function add(item: PackageTrackerItem) {
  const packages = await read();
  packages.push(item);
  return write(packages);
}

async function remove(code: string) {
  const packages = (await read()).filter((it) => it.code !== code);
  return write(packages);
}

const storage = {
  write,
  read,
  add,
  remove,
};

export default storage;
