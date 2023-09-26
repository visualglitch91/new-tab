export interface Torrent {
  activityDate: number;
  addedDate: number;
  downloadDir: string;
  downloadedEver: number;
  errorString: "";
  eta: number;
  id: number;
  name: string;
  percentDone: number;
  queuePosition: number;
  rateDownload: number;
  rateUpload: number;
  recheckProgress: number;
  sizeWhenDone: number;
  status: number;
  totalSize: number;
  uploadRatio: number;
  uploadedEver: number;
}
