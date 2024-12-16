import { loadValue, saveValue } from "./storage";

const configVersion = 1;
const storageKey = "user-config";

interface UserConfig {
  disableBlurEffects?: boolean;
}

function loadConfig() {
  const config = loadValue<{ version: number; value: UserConfig }>(storageKey);

  if (config && config.version === configVersion) {
    return config.value;
  }

  return undefined;
}

export function getConfig<T extends keyof UserConfig>(
  key: T
): UserConfig[T] | undefined {
  const config = loadConfig();
  return config?.[key];
}

export function setConfig<T extends keyof UserConfig>(
  key: T,
  value: UserConfig[T]
) {
  const config = loadConfig();

  saveValue(storageKey, {
    version: configVersion,
    value: { ...config, [key]: value },
  });
}
