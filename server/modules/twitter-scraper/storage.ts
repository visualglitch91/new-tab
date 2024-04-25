import Storage from "$server/storage";

const storage = new Storage<{ id: string; lastTweetDate: string }>(
  "twitter-scraper"
);

export default storage;
