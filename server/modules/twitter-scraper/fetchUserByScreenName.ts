import { memoizeWithTimeout } from "$server/utils";
import twitterReq from "./twitterReq";

const fetchUserByScreenName = memoizeWithTimeout(async (screenname: string) => {
  const path = `/qW5u-DAuXpMEG0zA1F7UGQ/UserByScreenName?variables=%7B%22screen_name%22%3A%22${screenname}%22%2C%22withSafetyModeUserFields%22%3Atrue%7D&features=%7B%22hidden_profile_likes_enabled%22%3Atrue%2C%22hidden_profile_subscriptions_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22subscriptions_verification_info_is_identity_verified_enabled%22%3Atrue%2C%22subscriptions_verification_info_verified_since_enabled%22%3Atrue%2C%22highlights_tweets_tab_ui_enabled%22%3Atrue%2C%22responsive_web_twitter_article_notes_tab_enabled%22%3Atrue%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%7D&fieldToggles=%7B%22withAuxiliaryUserLabels%22%3Afalse%7D`;
  const res = await twitterReq(path, "GET");
  const user = res.data.user?.result?.legacy;
  const userId = res.data.user?.result?.rest_id;

  if (!user || !userId) {
    throw new Error(`${screenname} user not found.`);
  }

  return { id: userId, ...user };
}, 2 * 60 * 60_000);

export default fetchUserByScreenName;
