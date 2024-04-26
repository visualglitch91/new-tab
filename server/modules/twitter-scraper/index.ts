import ky from "ky";
import config from "$server/config";
import { createAppModule, logger } from "$server/utils";
import fetchTweets from "./fetchTweets";
import storage from "./storage";
import fetchUserByScreenName from "./fetchUserByScreenName";

const { webhook, users } = config.twitter_scraper;

function getLastFetchDate(userId: string) {
  return storage.get(userId)?.lastTweetDate || null;
}

function setLastFetchDate(userId: string, date: string) {
  return storage.save({ id: userId, lastTweetDate: date });
}

async function fetchLatestTweets(
  userId: string,
  processTweet: (tweet: any) => Promise<void>
) {
  const since = getLastFetchDate(userId);

  try {
    const tweets = await fetchTweets(
      userId,
      false,
      since ? new Date(since) : null
    );

    if (tweets.length === 0) {
      return;
    }

    setLastFetchDate(userId, tweets[0].created_at);

    const reversedTweets = [...tweets].reverse();

    for (let tweet of reversedTweets) {
      await processTweet(tweet);
    }
  } catch (err) {
    logger.error(err);
  }
}

async function scrape() {
  for (let screenname of users) {
    const user = await fetchUserByScreenName(screenname);

    await fetchLatestTweets(user.id, async (tweet) => {
      ky.post(webhook, { json: { tweet, user } }).catch(logger.error);
    });
  }
}

export default createAppModule("twitter-scraper", () => {
  const loop = () => {
    scrape().then(() => setTimeout(loop, 5 * 60_000));
  };

  loop();
});
