# secureauth-spicedb-poc

small todo app that uses SecureAuth for login/identity and SpiceDB for relationship-based authorisation

Barebones pnpm + Turborepo workspace.

## Structure

- `apps/api/` — minimal Express API
- `apps/web/` — minimal Next.js web app
- `packages/` — add shared packages here when you need them

## Getting started

1. Run `pnpm install`
2. Add apps or packages
3. Run `pnpm dev`


# SpiceDB comands 
- `docker run --rm -p 50051:50051 authzed/spicedb serve --grpc-preshared-key "devsecret" --datastore-engine memory` - starts a SpiceDB server in memory with gRPC on port 50051 for learning
- `zed schema write schema/todos.zed` - zed schema write writes a .zed schema file to the current permissions system.
- `zed schema read` - to view the scheme you created 
- `zed permission check todos/list:list_1 view todos/user:alice --explain` - check permissions set in schema