# voice-enhancement-app

The core functionality of the ai-coustics voice enhancement web app packaged for self-hosting.

This repo can be built either as a Node application for deployment on a server, or as a static site. The only difference between the two is that the settings entered on the _Settings_ page will only be stored client-side for the static version, whereas the Node version will store them on the server.

## Requirements

- Docker with Docker Compose

### Node version

- A web server running Linux

### Static version

- A static asset host

## Setup

Start by cloning this GitHub repository.

```bash
git clone git@github.com:ai-coustics/voice-enhancement-app.git
```

### Configuration

Copy the `.env.example` file to `.env.`

```bash
cd voice-enhancement-app
cp .env.example .env
```

#### Build type

Inside the `.env` file, the `ADAPTER` variable controls which type of build we want.

For a server deployment, use:

```
ADAPTER=node
```

For a static site, use:

```
ADAPTER=static
```

#### Internal port

The `PORT` variable controls on which port the server-based version will listen for incoming connections. Any other infrastructure around your deployment, like a reverse proxy, needs to point requests for the app to this port.

For static builds, `PORT` is ignored.

#### API settings

This app uses the [official ai-coustics API](https://developers.ai-coustics.com/documentation) under the hood to enhance audio. For this to work, you need to supply an API root URL and an API key.

The host URL is controlled by `AIC_API_ROOT` and should generally be left as the default value of `https://api.ai-coustics.com/v1`.

The API key is controlled by `AIC_API_KEY`. To get one, you need to [sign up for an ai-coustics developer account](https://ai-coustics.com/api/), and generate a key through the developer portal.

Both the API URL and the API key can be supplied either as environment variables at this point, in which case they will be baked into the app (for both Node and static builds), or they can be entered at runtime within the app itself via the _Settings_ page. In other words, the API-related environment variables are optional.

## Building and running

The supplied `docker-compose.yml` will read the `ADAPTER` environment variable and choose the correct build. Run:

```bash
docker compose up -d
```

With `ADAPTER=node`, you will now have a running instance of the app at `localhost:PORT`.

With `ADAPTER=static`, the static assets for serving will have been output to the `./build` folder. You'll need to upload them to your static host as a separate step.
