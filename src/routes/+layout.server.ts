import { env } from "$env/dynamic/private";
import { AIC_API_ROOT, AIC_API_KEY } from "$env/static/private";
import { GET as fetchSettings } from "./server/settings/+server";
import { building } from '$app/environment';

export async function load() {
  const data = {
    settings: { apiRoot: "", apiKey: "", fetchedAt: "buildTime" }
  };

  if (building) {
    // Pre-rendering at build-time, check static env vars only.
    if (AIC_API_ROOT && AIC_API_KEY) {
      data.settings.apiRoot = AIC_API_ROOT;
      data.settings.apiKey = AIC_API_KEY;
    }
    return data;
  }

  data.settings.fetchedAt = "requestTime";

  // Running as part of SSR at request-time, start by checking saved settings.
  const response = await fetchSettings();
  if (response.ok) {
    const settings = await response.json();
    if (settings.apiRoot && settings.apiKey) {
      data.settings.apiRoot = settings.apiRoot;
      data.settings.apiKey = settings.apiKey;
      return data;
    }
  }

  // If none found, check dynamic env vars.
  if (env.AIC_API_ROOT && env.AIC_API_KEY) {
    data.settings.apiRoot = env.AIC_API_ROOT;
    data.settings.apiKey = env.AIC_API_KEY;
  }

  return data;
};
