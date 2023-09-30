import { PackageTrackerItem } from "@home-control/types/package-tracker";
import Storage from "../../storage";

const storage = new Storage<PackageTrackerItem>("package-tracker");

export default storage;
