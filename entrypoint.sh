#!/bin/sh -x
if [ "$*" != "" ]; then
    "$@"
    exit
fi

export DENO_TLS_CA_STORE=system
export TARGET_CLI=${TARGET_CLI:-cat}
deno run \
    --allow-env=DISCORD_TOKEN,PATH \
    --allow-net \
    --allow-run=/usr/bin/env \
    --quiet \
    ./bot.ts \
    "${DISCORD_NICKNAME+--discord-nickname=}${DISCORD_NICKNAME}" \
    "${DISCORD_PLAYING+--discord-playing=}${DISCORD_PLAYING}" \
    "${DISCORD_TOKEN+--discord-token=}${DISCORD_TOKEN}" \
    "${ENV_ARGS+--env-args=}${ENV_ARGS}" \
    "${ENV_COMMAND+--env-command=}${ENV_COMMAND}" \
    "${TARGET_ARGS_TO_USE_STDIN+--target-args-to-use-stdin=}${TARGET_ARGS_TO_USE_STDIN}" \
    "${TARGET_CLI+--target-cli=}${TARGET_CLI}" \
    "${TARGET_DEFAULT_ARGS+--target-default_args=}${TARGET_DEFAULT_ARGS}" \
    "${TIMEOUT_ARGS+--timeout-args=}${TIMEOUT_ARGS}" \
    "${TIMEOUT_COMMAND+--timeout-command=}${TIMEOUT_COMMAND}" \
    || echo "failed"
