FROM oven/bun:alpine AS build
LABEL maintainer="@imnya"

# Set the working directory
COPY app /code/app

RUN chmod +x /code/app/run.sh

WORKDIR /code/app
RUN mkdir -p /code/app/temp

# Install dependencies
RUN bun install

# Set timezone to Asia/Seoul
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime \
    && echo "Asia/Seoul" > /etc/timezone \
    && apk del tzdata

# Cron job
RUN apk add --no-cache curl
RUN curl -Lo /code/app/supercronic https://github.com/aptible/supercronic/releases/latest/download/supercronic-linux-amd64 \
    && chmod +x /code/app/supercronic

RUN mkdir -p /code/app/temp/logs

COPY cron /code/app/cron
RUN chmod +x /code/app/cron

CMD ["/code/app/supercronic", "/code/app/cron"]
