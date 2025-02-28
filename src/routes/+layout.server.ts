import { PUBLIC_AIC_API_ROOT, PUBLIC_AIC_API_KEY } from "$env/static/public";
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
  const apiRoot = PUBLIC_AIC_API_ROOT || '';
  const apiKey = PUBLIC_AIC_API_KEY || '';

  return {
    serverSettings: { apiRoot, apiKey }
  };
}; 