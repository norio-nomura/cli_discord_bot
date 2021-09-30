#!/bin/sh

# Avoid passing options via environment variables or comandline arguments
options="\
${DISCORD_NICKNAME+DISCORD_NICKNAME: '${DISCORD_NICKNAME}', }\
${DISCORD_PLAYING+DISCORD_PLAYING: '${DISCORD_PLAYING}', }\
${DISCORD_TOKEN+DISCORD_TOKEN: '${DISCORD_TOKEN}', }\
${ENV_ARGS+ENV_ARGS: '${ENV_ARGS}', }\
${ENV_COMMAND+ENV_COMMAND: '${ENV_COMMAND}', }\
${PATH+PATH: '${PATH}', }\
${TARGET_ARGS_TO_USE_STDIN+TARGET_ARGS_TO_USE_STDIN: '${TARGET_ARGS_TO_USE_STDIN}', }\
${TARGET_CLI+TARGET_CLI: '${TARGET_CLI}', }\
${TARGET_DEFAULT_ARGS+TARGET_DEFAULT_ARGS: '${TARGET_DEFAULT_ARGS}', }\
${TIMEOUT_ARGS+TIMEOUT_ARGS: '${TIMEOUT_ARGS}', }\
${TIMEOUT_COMMAND+TIMEOUT_COMMAND: '${TIMEOUT_COMMAND}', }\
"
exec env -i PATH=${PATH} DENO_TLS_CA_STORE=system deno run \
    --allow-env=PATH \
    --allow-net \
    --allow-run=/usr/bin/env \
    --quiet \
- <<EOF
$(awk -v options="${options}" '{sub("// Set options here", options); print}' bot.ts) 
EOF
