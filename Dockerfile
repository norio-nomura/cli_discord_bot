# syntax=docker/dockerfile:1
ARG DOCKER_IMAGE=ubuntu:latest
FROM ${DOCKER_IMAGE}
ARG USERNAME=bot
RUN --mount=type=cache,target=/var/cache/apt --mount=type=cache,sharing=locked,target=/var/lib/apt \
    export DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true && \
    apt-get update -qq && apt-get install -qq \
    ca-certificates curl unzip > /dev/null && \
    curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=/usr/local sh > /dev/null && \
    apt-get purge --auto-remove -qq curl unzip > /dev/null && \
    mkdir -p /etc/skel/.cache/deno && \
    useradd -m $USERNAME

USER $USERNAME

# Install Bot
WORKDIR /cli_discord_bot

# Cache Dependencies
COPY deps.ts ./
RUN deno cache --quiet ./deps.ts

# Install remains
COPY bot.ts entrypoint.sh mod.ts printOptionsFromEnv.ts ./
COPY bot ./bot/

# Start Bot
ENTRYPOINT [ "./entrypoint.sh" ]
