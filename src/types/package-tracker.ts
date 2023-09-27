export interface PackageTrackerItem {
  name: string;
  code: string;
  lastEvent?: {
    at: string | null;
    description: string;
    location: string;
  };
}
