export interface PackageTrackerItem {
  id: string;
  name: string;
  code: string;
  status:
    | "not-found"
    | "pending-payment"
    | "in-transit"
    | "en-route"
    | "delivered";
  eventCount: number;
  lastEvent?: {
    at: string | null;
    description: string;
    location: string;
  };
}
