import { PUBLIC_AIC_API_ROOT, PUBLIC_AIC_API_KEY } from '$env/static/public';
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { AicousticsApi } from '../api';
import { RequestError } from '../request';

const testFilePath = join(__dirname, '../../../../assets/test/1234.mp3');

// NB. This test actually uses the live API so will take a few seconds.

describe('AicousticsApi', () => {
  const maxAttempts = 60;
  const checkInterval = 1000;

  let api: AicousticsApi;
  beforeEach(() => {
    api = new AicousticsApi(PUBLIC_AIC_API_ROOT, PUBLIC_AIC_API_KEY);
  });

  it('accepts an enhancement request and generates a download', async () => {
    const fileBuffer = readFileSync(testFilePath);
    const file = new File([fileBuffer], '1234.mp3', { type: 'audio/mpeg' });

    const generatedName = await api.enhance({ file });
    expect(generatedName).toBeDefined();

    const download = new Promise<void>((resolve, reject) => {
      let attempts = 0;

      const interval = setInterval(async () => {
        try {
          attempts++;
          const buffer = await api.download(generatedName);
          expect(buffer).toBeDefined();
          expect(buffer.byteLength).toBeGreaterThan(0);
          clearInterval(interval);
          resolve();
        } catch (err: unknown) {
          expect(err).toBeInstanceOf(RequestError);
          const error = err as RequestError;
          expect(error.statusCode).toBe(412);
          console.log(
            `Waiting for enhancement (attempt ${attempts}/${maxAttempts})`,
            error.message
          );
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            reject(new Error(`Download failed after ${maxAttempts} attempts`));
          }
        }
      }, checkInterval);
    });

    await download;
  }, maxAttempts * checkInterval);
});
