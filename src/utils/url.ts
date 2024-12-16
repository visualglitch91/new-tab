export function getSearchParam(key: string) {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}

export function setSearchParam(map: { [key: string]: any }) {
  const url = new URL(window.location.href);

  Object.keys(map).forEach((key) => {
    const value = map[key];

    if (typeof value === "undefined") {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

export function removeParamsFromUrl(keys: string[]) {
  window.history.replaceState(
    null,
    "",
    setSearchParam(
      keys.reduce((acc, key) => ({ ...acc, [key]: undefined }), {})
    ).toString()
  );
}
