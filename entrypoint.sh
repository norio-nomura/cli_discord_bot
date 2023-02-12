#!/bin/bash

vars=()
for v in DENO_TLS_CA_STORE HTTP_PROXY HTTPS_PROXY PATH; do
    vars=("${vars[@]}" "${!v+${v}=${!v}}")
done

# Avoid passing options via environment variables or comandline arguments
exec env -i ${vars[@]} deno run \
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
