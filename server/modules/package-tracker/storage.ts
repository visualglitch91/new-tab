import { PackageTrackerItem } from "$common/types/package-tracker";
import Storage from "$server/storage";

const storage = new Storage<PackageTrackerItem>("package-tracker");

export default storage;
