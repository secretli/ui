FROM node:lts-alpine AS builder

COPY . .
RUN npm install
RUN npm run build

FROM nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
COPY --from=builder dist/ /usr/share/nginx/html
