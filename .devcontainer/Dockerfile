# syntax=docker/dockerfile:1
ARG DOCKER_IMAGE=ubuntu:latest
FROM ${DOCKER_IMAGE}
ARG USERNAME=bot
RUN --mount=type=cache,target=/var/cache/apt --mount=type=cache,sharing=locked,target=/var/lib/apt \
    export DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true && \
    apt-get update -qq && apt-get install -qq \
    ca-certificates curl git sudo unzip > /dev/null && \
    curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=/usr/local sh > /dev/null && \
    apt-get purge --auto-remove -qq curl unzip > /dev/null && \
    mkdir -p /etc/skel/.cache/deno && \
    useradd -m $USERNAME
    
RUN useradd -m debug && \
    echo $USERNAME ALL=\(debug\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME && \
    chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME
