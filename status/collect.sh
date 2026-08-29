#!/usr/bin/env bash
# Push live cluster telemetry to the site (public/status.json).
#
# Setup on the cluster (once):
#   1. Clone this repo:  git clone https://github.com/l064n/l064n.github.io
#   2. Auth for push:    git config credential.helper store
#      (fine-grained PAT with Contents: write on this repo, stored once
#       when you run `git push` manually)
#   3. Edit the NODES array below to match your cluster.
#   4. Cron (every 5 min):
#      */5 * * * * /path/to/l064n.github.io/status/collect.sh >> /tmp/cluster-status.log 2>&1
set -uo pipefail

# cron's PATH is minimal — make sure nvidia-smi/rocm-smi/lspci are found.
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BRANCH="main"

# "display name|ssh target|role"  — use "local" as target to collect on this machine.
# This script is meant to run on big-brain2 (the 2x MI50 node), which reaches
# small-brain over ssh (key-based auth must be set up on big-brain2).
NODES=(
  "big-brain2|local|compute"
  "small-brain|x1@small-brain|edge"
)

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

i=0
for entry in "${NODES[@]}"; do
  name="${entry%%|*}"
  rest="${entry#*|}"
  target="${rest%%|*}"
  role="${rest#*|}"
  [ "$role" = "$rest" ] && role=""

  if [ "$target" = "local" ]; then
    out="$(NAME="$name" ROLE="$role" python3 "$SCRIPT_DIR/collect_node.py" 2>/dev/null)"
  else
    # Ship the collector to the remote node, then run it there.
    if ssh -o ConnectTimeout=6 -o BatchMode=yes "$target" "mkdir -p /tmp/cluster-status" 2>/dev/null; then
      scp -o ConnectTimeout=6 -o BatchMode=yes "$SCRIPT_DIR/collect_node.py" \
        "$target:/tmp/cluster-status/collect_node.py" 2>/dev/null
      out="$(ssh -o ConnectTimeout=6 -o BatchMode=yes "$target" \
        "NAME='$name' ROLE='$role' python3 /tmp/cluster-status/collect_node.py" 2>/dev/null)"
    else
      out=""
    fi
  fi

  if [ -n "$out" ]; then
    printf '%s' "$out" > "$tmp/node-$i.json"
  else
    printf '{"name":"%s","role":"","online":false,"gpus":[]}' "$name" > "$tmp/node-$i.json"
  fi
  i=$((i + 1))
done

python3 - "$tmp" "$i" > "$REPO_DIR/public/status.json" <<'PY'
import json
import os
import sys
import time

tmp, count = sys.argv[1], int(sys.argv[2])
nodes = []
for i in range(count):
    try:
        with open(os.path.join(tmp, f"node-{i}.json")) as fh:
            nodes.append(json.load(fh))
    except Exception:
        pass
print(
    json.dumps(
        {
            "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "nodes": nodes,
        },
        indent=2,
    )
)
PY

cd "$REPO_DIR"

# Only push when the telemetry actually changed.
if [ -z "$(git status --porcelain -- public/status.json)" ]; then
  echo "$(date -u +%H:%M)Z status unchanged, skipping push"
  exit 0
fi

# Commit first, then sync: `pull --rebase` needs a clean working tree, and
# committing before pulling means site commits pushed from elsewhere (e.g.
# deploys) get rebased under the telemetry commit instead of deadlocking it.
git add public/status.json
git commit -m "status: cluster telemetry $(date -u +%H:%M)Z" >/dev/null

if ! git pull --rebase origin "$BRANCH" >/dev/null 2>&1; then
  git rebase --abort >/dev/null 2>&1 || true
  echo "$(date -u +%H:%M)Z rebase failed, retrying next run"
  exit 1
fi

git push origin "$BRANCH" >/dev/null 2>&1 \
  && echo "$(date -u +%H:%M)Z pushed status update" \
  || echo "$(date -u +%H:%M)Z push failed (check credentials)"
