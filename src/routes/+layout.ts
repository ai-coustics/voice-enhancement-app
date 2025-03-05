import { browser } from '$app/environment';

// We prerender for both node and static builds, because why not.
export const prerender = true;

// ssr needs to be set to true for the load functions to run when pre-rendering,
// even if we technically don't do SSR at request time for the static build.
export const ssr = true;

// This outputs routes in the standard format of enhance/index.html.
export const trailingSlash = 'always';

const defaultApiRoot = "https://api.ai-coustics.com/v1";

export async function load({ data }) {
  const hasServer = data.settings.fetchedAt === "requestTime";

  if (browser && !hasServer) {
    // This means we're running as a static site, check local storage.
    const apiRoot = localStorage.getItem('apiRoot');
    const apiKey = localStorage.getItem('apiKey');
    if (apiRoot && apiKey) {
      data.settings.apiRoot = apiRoot;
      data.settings.apiKey = apiKey;
    }
  }

  return {
    settings: {
      apiRoot: data.settings.apiRoot || defaultApiRoot,
      apiKey: data.settings.apiKey,
      hasServer
    }
  };
}