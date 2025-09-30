FROM oven/bun:latest

# Install Redis
RUN apt-get update && \
    apt-get install -y redis-server && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json bun.lock ./
COPY src ./src

RUN bun install

EXPOSE 3000 6379

# Create a startup script that passes all arguments
RUN echo '#!/bin/sh\n\
    redis-server --daemonize yes\n\
    exec bun run src/index.ts "$@"' > /app/start.sh && \
    chmod +x /app/start.sh

ENTRYPOINT ["/app/start.sh"]