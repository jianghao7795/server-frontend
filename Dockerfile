FROM node:18.20.4 AS builder
LABEL org.opencontainers.image.authors="jianghao"
RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com
RUN pnpm install
RUN pnpm run build


# multi-stage builds
FROM nginx:stable
LABEL org.opencontainers.image.authors="jianghao"
RUN rm -rf /usr/share/nginx/html/* && mkdir -p /usr/share/nginx/html/frontend
COPY --from=builder /app/dist /usr/share/nginx/html/frontend
COPY ./conf/my.conf /etc/nginx/conf.d/default.conf
