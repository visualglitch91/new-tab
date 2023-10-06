export interface PackageTrackerItem {
  id: string;
  name: string;
  code: string;
  status: "not-found" | "pending-payment" | "in-transit" | "delivered";
  lastEvent?: {
    at: string | null;
    description: string;
    location: string;
  };
}
