#!/bin/sh
if [ "$*" != "" ]; then
    "$@"
    exit
fi

export DENO_TLS_CA_STORE=system
export TARGET_CLI=${TARGET_CLI:-cat}
deno run \
    --allow-env=\
DISCORD_NICKNAME,\
DISCORD_PLAYING,\
DISCORD_TOKEN,\
ENV_ARGS,\
ENV_COMMAND,\
PATH,\
TARGET_ARGS_TO_USE_STDIN,\
TARGET_CLI,\
TARGET_DEFAULT_ARGS,\
TIMEOUT_ARGS,\
TIMEOUT_COMMAND \
    --allow-net \
    --allow-run=/usr/bin/env \
    --quiet \
    ./bot.ts || echo "failed"
