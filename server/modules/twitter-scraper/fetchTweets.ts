import { wait } from "$server/utils";
import twitterReq from "./twitterReq";

async function fetchEntries(userId: string, cursor?: string | null) {
  const count = "20";
  const endCursor = cursor ? `%22cursor%22%3A%22${cursor}%22%2C` : "";
  const resource = "uYU5M2i12UhDvDTzN6hZPg";
  const endpoint = "UserTweetsAndReplies";
  const variable = `?variables=%7B%22userId%22%3A%22${userId}%22%2C%22count%22%3A${count}%2C${endCursor}%22includePromotedContent%22%3Atrue%2C%22withCommunity%22%3Atrue%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D`;
  const feature = `&features=%7B%22rweb_lists_timeline_redesign_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`;
  const apiPath = `/${resource}/${endpoint}${variable}${feature}`;

  const res = await twitterReq(apiPath, "GET");

  let entries: any[] =
    res["data"]["user"]["result"]["timeline_v2"]["timeline"]["instructions"];

  for (const item of entries) {
    if (item["type"] == "TimelineAddEntries") {
      entries = item["entries"];
    }
  }

  return entries;
}

function checkAuthor(obj: any, uid: string, includeRetweets?: boolean) {
  if (
    obj.hasOwnProperty("legacy") &&
    ((obj["legacy"].hasOwnProperty("retweeted") &&
      obj["legacy"]["retweeted"] === true) ||
      obj["legacy"].hasOwnProperty("retweeted_status_result")) &&
    !includeRetweets
  ) {
    return false;
  }

  if (obj.hasOwnProperty("user_id_str") && obj["user_id_str"] === uid) {
    return true;
  } else if (
    obj.hasOwnProperty("legacy") &&
    obj["legacy"].hasOwnProperty("user_id_str") &&
    obj["legacy"]["user_id_str"] === uid
  ) {
    return true;
  }

  return false;
}

const maxTweets = 10;

export default async function fetchTweets(
  userId: string,
  inncludeRetweets?: boolean,
  maxDate: Date | null = null
) {
  let next = null;
  let abortSignal = false;
  const tweets: any[] = [];

  const pushTweet = (tweet: any) => {
    if (
      maxDate ? new Date(tweet.created_at) > maxDate : tweets.length < maxTweets
    ) {
      tweets.push(tweet);
    } else {
      abortSignal = true;
    }
  };

  const parseEntry = (obj: any) => {
    const recurse = (currentObj: any) => {
      if (typeof currentObj !== "object" || currentObj === null) {
        return;
      }

      if (
        currentObj["__typename"] === "TweetWithVisibilityResults" &&
        currentObj.hasOwnProperty("tweet") &&
        checkAuthor(currentObj["tweet"], userId, inncludeRetweets)
      ) {
        pushTweet(currentObj["tweet"]["legacy"]);
      } else if (
        currentObj.hasOwnProperty("__typename") &&
        currentObj["__typename"] === "Tweet" &&
        checkAuthor(currentObj, userId, inncludeRetweets)
      ) {
        pushTweet(currentObj["legacy"]);
      }

      for (let key in currentObj) {
        if (currentObj.hasOwnProperty(key)) {
          recurse(currentObj[key]);
        }
      }
    };

    recurse(obj);
  };

  const parseEntries = async (entries: any[]) => {
    for (let item of entries) {
      if (
        item["entryId"].startsWith("profile-conversation") ||
        item["entryId"].startsWith("tweet-")
      ) {
        parseEntry(item);
      } else if (
        item["entryId"].startsWith("cursor-bottom") &&
        entries.length > 2
      ) {
        next = item["content"]["value"];
        return;
      }
    }

    next = "finished";
  };

  while (next != "finished" && !abortSignal) {
    const entries = await fetchEntries(userId, next);
    await parseEntries(entries);
    await wait(3000);
  }

  return tweets;
}
