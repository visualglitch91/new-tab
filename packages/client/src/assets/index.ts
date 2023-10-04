export function getAssetUrl(file: string) {
  return new URL(`./${file}`, import.meta.url).href;
}
