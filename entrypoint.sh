#!/bin/sh

# Avoid passing options via environment variables or comandline arguments
deno run -A printOptionsFromEnv.ts | \
exec env -i PATH=${PATH} DENO_TLS_CA_STORE=system deno run \
    --allow-env=PATH \
    --allow-net \
    --allow-run=/usr/bin/env \
    --quiet \
    bot.ts
