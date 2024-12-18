# Stage 1 (Or Image 1): Build the Angular application:
FROM node:20.10.0-alpine3.18 as node
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@8.11.0
RUN pnpm install
COPY . .
RUN pnpm build

# Stage 2 (Or Image 2): Serve (run) the application with Nginx:
FROM nginx:stable
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/8xcrm/browser /usr/share/nginx/html
EXPOSE 80