import { env } from "$env/dynamic/private";
import { GET as fetchSettings } from "./server/settings/+server";

export async function load() {
  const response = await fetchSettings();
  if (response.ok) {
    const settings = await response.json();
    if (settings.apiRoot && settings.apiKey) {
      return {
        serverSettings: settings
      };
    }
  }

  // If no settings file found, we check environment variables.
  const apiRoot = env.AIC_API_ROOT || '';
  const apiKey = env.AIC_API_KEY || '';

  return {
    serverSettings: { apiRoot, apiKey }
  };
}; 