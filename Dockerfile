FROM node:22-alpine AS build
WORKDIR /app
RUN echo "Installing..."
COPY package*.json ./
RUN npm ci
COPY . .
ARG ADAPTER=node
ENV ADAPTER=${ADAPTER}
RUN echo "Building..."
RUN npm run build
RUN npm prune --production

# ADAPTER=node
FROM node:22-alpine AS node
WORKDIR /app
RUN echo "Deploying..."
COPY --from=build /app/build build/
COPY package.json .
ENV NODE_ENV=production
ARG PORT=3000
ENV PORT=${PORT}
EXPOSE $PORT
RUN echo "Running..."
CMD PORT=$PORT node build

# ADAPTER=static
FROM node:22-alpine AS static
COPY --from=build /app/build /app/build/
CMD ["sh", "-c", "cp -R /app/build/* /app/static && echo 'Static build is now in ./build'"]
