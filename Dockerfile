FROM oven/bun:alpine AS build
LABEL maintainer="@imnya"

# Set the working directory
COPY app /code/app

RUN chmod +x /code/app/run.sh

WORKDIR /code/app
RUN mkdir -p /code/app/temp

# Install dependencies
RUN bun install

# Build the project
RUN bun build index.ts --compile --minify --sourcemap --target bun --outfile ./run

FROM oven/bun:alpine AS runner
LABEL maintainer="@imnya"

# Set the working directory
WORKDIR /code
RUN mkdir -p /code/app

# Copy the built files from the build stage
COPY --from=build /code/app/run /code/app/run
COPY --from=build /code/app/run.sh /code/app/run.sh

RUN mkdir -p /code/app/temp

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
