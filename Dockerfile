FROM node:lts-slim AS build
WORKDIR /src
RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm ci

COPY . ./
RUN ng build --configuration=production

FROM nginx:stable AS final
EXPOSE 80

RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx \
 && chown -R nginx:nginx /var/cache/nginx /var/run /var/log/nginx \
 && sed -i '/^user\s\+/d' /etc/nginx/nginx.conf

USER nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build src/dist/browser /usr/share/nginx/html
