FROM node:22-alpine AS builder
WORKDIR /app
RUN echo "Installing..."
COPY package*.json ./
RUN npm ci
COPY . .
RUN echo "Building..."
RUN npm run build
RUN npm prune --production

FROM node:22-alpine
WORKDIR /app
RUN echo "Deploying..."
COPY --from=builder /app/build build/
COPY package.json .
ENV NODE_ENV=production
ARG PORT
ENV AIC_APP_PORT=${PORT}
EXPOSE $AIC_APP_PORT
RUN echo "Running..."
CMD PORT=$AIC_APP_PORT node build
