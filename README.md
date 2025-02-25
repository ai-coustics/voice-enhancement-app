# voice-enhancement-app

A slimmed-down version of the ai-coustics voice enhancement web app designed for self-hosting.

## Configuration

The following two environment varriables must be provided to the application at runtime.

- `PUBLIC_AIC_API_ROOT`: The root URL for the API, e.g. `https://api.ai-coustics.com/v1`.
- `PUBLIC_AIC_API_KEY`: Your secret API key.

## Building

To create a production version:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deployment

TODO
