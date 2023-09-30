export interface PackageTrackerItem {
  id: string;
  name: string;
  code: string;
  lastEvent?: {
    at: string | null;
    description: string;
    location: string;
  };
}
