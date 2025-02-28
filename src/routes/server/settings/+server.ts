import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const apiRoot = formData.get('apiRoot');
    const apiKey = formData.get('apiKey');

    const settingsPath = path.join(process.cwd(), 'settings.json');
    const settings = { apiRoot, apiKey };
    await writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    return json(settings);
  } catch (err) {
    console.error('Failed to write settings file:', err);
    return error(500, 'Failed to save settings');
  }
}

export async function GET() {
  let settings = {
    apiRoot: '',
    apiKey: ''
  };
  try {
    const settingsPath = path.join(process.cwd(), 'settings.json');
    const data = await readFile(settingsPath, 'utf8');
    settings = JSON.parse(data);
    return json(settings);
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      console.debug('No settings.json file found.');
      return json(settings);
    } else {
      console.error('Error reading settings.json file:', err);
      return error(500, 'Failed to read settings');
    }
  }
}
