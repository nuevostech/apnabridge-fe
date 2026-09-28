#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

BUCKET="apnabridge-fe-production-509784655842"
DISTRIBUTION_ID="E2ZZ08GWEVMGT0"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

echo "==> Building"
npm run build

echo "==> Syncing dist/ to s3://$BUCKET"
# --delete only prunes stale build output; it must never touch the
# backend's user-upload prefixes (logos/, covers/, gallery/) that live
# in this same bucket.
aws s3 sync dist/ "s3://$BUCKET" --delete \
  --exclude "logos/*" \
  --exclude "covers/*" \
  --exclude "gallery/*"

echo "==> Invalidating CloudFront cache ($DISTRIBUTION_ID)"
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" >/dev/null

echo "==> Done. https://d3w0iuyqcxww13.cloudfront.net"
