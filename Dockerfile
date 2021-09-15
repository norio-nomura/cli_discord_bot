ARG DOCKER_IMAGE=ubuntu:18.04
FROM ${DOCKER_IMAGE}
RUN export DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true && apt-get -q update && \
    apt-get -q install -y \
    ca-certificates curl jq unzip && \
    rm -rf /var/lib/apt/lists/* && \
    curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=/usr/local sh && \
    curl -L https://github.com/cli/cli/releases/download/v2.0.0/gh_2.0.0_linux_amd64.tar.gz | tar zxf - --directory /usr --strip-components=1 && \
    apt-get purge --auto-remove -y curl unzip && \
    useradd -m bot

# Install Bot
WORKDIR /bot

# Cache Dependencies
COPY deps.ts .
USER bot
RUN deno cache ./deps.ts

# Install remains
COPY bot.ts entrypoint.sh ./
COPY bot ./bot/

# Start Bot
ENTRYPOINT [ "./entrypoint.sh" ]
