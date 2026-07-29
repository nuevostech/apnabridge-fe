# Deployment

Static React app, hosted on S3 behind CloudFront (no backend wired up yet — see
`docs/API.md` for what's still needed there).

## Infrastructure

| Resource | Value |
|---|---|
| AWS account | `509784655842` |
| Region | `us-east-1` |
| S3 bucket | `apnabridge-fe-production-509784655842` (private, CloudFront-only access) |
| CloudFront distribution | `E2ZZ08GWEVMGT0` |
| Live URL | https://d3w0iuyqcxww13.cloudfront.net |
| Origin Access Control | `apnabridge-fe-oac` (`E2UAVS9DTA0XVW`) |

The bucket blocks all public access; CloudFront reads from it via Origin Access
Control (SigV4-signed requests), not a public bucket policy or website endpoint.
404/403 responses from S3 (any path that isn't a real file) are rewritten to
`/index.html` with a `200`, so React Router's client-side routes work on direct
load and refresh.

No custom domain or ACM certificate is attached yet — it's served on the default
`*.cloudfront.net` domain over HTTPS (CloudFront's default certificate).

## Deploying

```bash
npm run deploy
```

This runs `scripts/deploy.sh`, which:
1. Builds the app (`vite build` → `dist/`)
2. Syncs `dist/` to the S3 bucket (`--delete`, so removed files don't linger)
3. Invalidates the CloudFront cache (`/*`) so the change is visible immediately
   instead of waiting out the cache TTL

Needs AWS credentials for the target account — either already exported in your
shell, or present in a `.env` at the repo root (the script sources it
automatically). `.env` is gitignored; never commit it.

## First-time setup (already done, for reference)

If this ever needs to be rebuilt from scratch — new AWS account, disaster
recovery, a second environment:

```bash
# 1. Private bucket
aws s3api create-bucket --bucket <bucket-name> --region us-east-1
aws s3api put-public-access-block --bucket <bucket-name> \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

# 2. Origin Access Control
aws cloudfront create-origin-access-control --origin-access-control-config \
  Name=<name>,SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3

# 3. CloudFront distribution — S3 origin via the OAC above, DefaultRootObject
#    index.html, CachePolicyId 658327ea-f89d-4fab-a63d-7e88639e58f6 (managed
#    CachingOptimized), CustomErrorResponses 403 and 404 -> /index.html (200).
aws cloudfront create-distribution --distribution-config file://cf-distribution-config.json

# 4. Bucket policy allowing only that distribution to read via CloudFront's
#    service principal (condition on AWS:SourceArn = the distribution ARN)
aws s3api put-bucket-policy --bucket <bucket-name> --policy file://bucket-policy.json
```

## Known gaps

- **No custom domain.** Point a domain at the CloudFront distribution
  (CNAME/ALIAS to `d3w0iuyqcxww13.cloudfront.net`) and attach an ACM
  certificate (must be in `us-east-1`) when one is ready.
- **No backend origin.** Once the API exists, add a second CloudFront origin
  and cache behavior (e.g. `/api/*` → API origin, `https-only`, no caching) —
  see the existing `product-inventory-fe-production` distribution
  (`E1ED1QPGDNZ4ZZ`) on this account for a working example of that pattern.
- **AWS credentials in `.env` are root account keys**, not a scoped IAM user.
  Fine for now; worth creating an IAM user/role with only S3 + CloudFront
  permissions on this bucket/distribution before anyone else touches this.
- **No CI.** Deploys are manual (`npm run deploy`) from a local machine.
