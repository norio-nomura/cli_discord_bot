# syntax=docker/dockerfile:1
ARG DOCKER_IMAGE=ubuntu:latest
FROM ${DOCKER_IMAGE}
ARG USERNAME=bot
RUN --mount=type=cache,target=/var/cache/apt --mount=type=cache,sharing=locked,target=/var/lib/apt \
    export DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true && \
    apt-get -q update && apt-get -q install -y \
    ca-certificates curl git sudo unzip && \
    curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=/usr/local sh && \
    apt-get purge --auto-remove -y curl unzip && \
    mkdir -p /etc/skel/.cache/deno && \
    useradd -m $USERNAME
    
RUN useradd -m debug && \
    echo $USERNAME ALL=\(debug\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME && \
    chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME
