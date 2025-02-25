import { PUBLIC_AIC_API_ROOT, PUBLIC_AIC_API_KEY } from "$env/static/public";
import { request } from "./request";

export type EnhancementRequest = {
  file: File;
  loudnessTargetLevel?: number;
  loudnessPeakLimit?: number;
  enhancementLevel?: number;
  transcodeKind?: string;
  modelArch?: string;
};

export class AicousticsApi {
  constructor(private apiRoot: string, private apiKey: string) {
  }

  public async enhance(payload: EnhancementRequest) {
    const snakePayload = {
      file: payload.file,
      loudness_target_level: payload.loudnessTargetLevel?.toString(),
      loudness_peak_limit: payload.loudnessPeakLimit?.toString(),
      enhancement_level: payload.enhancementLevel?.toString() ?? 1,
      transcode_kind: payload.transcodeKind ?? "WAV",
      model_arch: payload.modelArch ?? "FINCH"
    }

    const res = await this.call(
      'media/enhance',
      undefined,
      snakePayload,
    );

    const json = await res.json();
    return json.generated_name;
  }

  public async download(generatedName: string) {
    const res = await this.call(`media/${generatedName}`);
    const arrayBuffer = await res.arrayBuffer();
    return arrayBuffer;
  }

  private async call(
    endpoint: string,
    params?: Record<string, any>,
    payload?: Record<string, any>,
    options?: RequestInit
  ) {
    return request(this.apiRoot, endpoint, params, payload, {
      ...options,
      headers: {
        ...options?.headers,
        'X-API-Key': this.apiKey
      }
    });
  }
}

export const api = new AicousticsApi(PUBLIC_AIC_API_ROOT, PUBLIC_AIC_API_KEY);
