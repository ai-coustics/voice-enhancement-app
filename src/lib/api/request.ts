export class RequestError extends Error {
  public statusCode: number;
  public statusText: string;
  constructor(public response: Response, message: string) {
    super(message);
    this.statusCode = response.status;
    this.statusText = response.statusText;
  }
}

export async function request(
  base: string,
  endpoint: string,
  params?: Record<string, any>,
  payload?: Record<string, any>,
  options?: RequestInit
) {
  if (!base.endsWith('/')) base += '/';
  const url = new URL(endpoint, base);
  url.search = new URLSearchParams(params).toString();

  const opts = {
    ...options,
    method: payload ? 'POST' : 'GET',
    body: asMultipartFormData(payload)
  };

  const response = await fetch(url.toString(), opts);
  if (!response.ok) {
    let message = "Unknown error.";
    try {
      const json = await response.json();
      if (json?.detail) {
        message = json.detail;
      }
    } catch {
      // If we didn't get any json, just move on.
    }
    throw new RequestError(response, message);
  }

  return response;
}

function asMultipartFormData(payload?: Record<string, any>) {
  if (!payload) {
    return undefined;
  }

  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  }
  return formData;
}
