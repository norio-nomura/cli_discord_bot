ARG DOCKER_IMAGE=ubuntu:18.04
FROM ${DOCKER_IMAGE}
ARG USERNAME=bot
RUN export DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true && apt-get -q update && \
    apt-get -q install -y \
    ca-certificates curl git unzip && \
    rm -rf /var/lib/apt/lists/* && \
    curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=/usr/local sh && \
    apt-get purge --auto-remove -y curl unzip && \
    useradd -m $USERNAME

RUN DENO_DIR=/workspace/.cache && \
    HOME=/home/$USERNAME && \
    mkdir -p $DENO_DIR $HOME/.vscode-server $HOME/.vscode-server-insiders && \
    chown -R $USERNAME:$USERNAME $DENO_DIR $HOME/.vscode-server $HOME/.vscode-server-insiders
