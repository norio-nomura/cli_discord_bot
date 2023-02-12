#!/bin/sh

# Avoid passing options via environment variables or comandline arguments
exec env -i PATH=${PATH} DENO_TLS_CA_STORE=system deno run \
    --allow-env=PATH \
    --allow-net \
    --allow-run=/usr/bin/env \
    --allow-read=${TMPDIR:-/tmp} \
    --allow-write=${TMPDIR:-/tmp} \
    --quiet \
    "$@" \
    bot.ts <<EOF
$(deno eval 'import { printOptionsFromEnv } from "./mod.ts"; printOptionsFromEnv();')
EOF
