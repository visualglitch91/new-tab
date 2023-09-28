export interface JDownloaderItem {
  addedDate: number;
  extractionStatus: string;
  statusIconKey: string;
  finished: boolean;
  packageUUID: number;
  uuid: number;
  speed: number;
  url: string;
  enabled: boolean;
  bytesLoaded: number;
  host: string;
  name: string;
  bytesTotal: number;
  finishedDate: number;
  status: string;
}
