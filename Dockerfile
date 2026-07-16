FROM docker.io/oven/bun:1-alpine AS builder
LABEL org.opencontainers.image.authors="jianghao"
RUN mkdir -p /app
WORKDIR /app
COPY . /app

# RUN npm config set registry https://registry.npmmirror.com
# RUN npm install -g pnpm
# RUN pnpm config set registry https://registry.npmmirror.com
RUN bun install --registry https://registry.npmmirror.com
RUN bun run build


# multi-stage builds
FROM docker.io/library/nginx:alpine
LABEL org.opencontainers.image.authors="jianghao"

RUN rm -rf /usr/share/nginx/html/* && mkdir -p /usr/share/nginx/html/frontend
COPY --from=builder /app/dist /usr/share/nginx/html/frontend
COPY ./conf/config.conf /etc/nginx/conf.d/default.conf
