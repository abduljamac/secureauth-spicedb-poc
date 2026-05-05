# secureauth-spicedb-poc

small todo app that uses SecureAuth for login/identity and SpiceDB for relationship-based authorisation

## SpiceDB Commands
Start a SpiceDB server in memory with gRPC on port 50051:

```bash
docker run --rm -p 50051:50051 authzed/spicedb serve --grpc-preshared-key "devsecret" --datastore-engine memory
```

Common `zed` CLI operations:

```bash
# Write schema
zed schema write schema/todos.zed

# Create Alice as owner of a list:
# Zed relationship create todos/todo:todo_1 parent todos/list:list_1
zed relationship create todos/list:list_1 owner todos/user:alice
zed relationship create todos/todo:todo_1 parent todos/list:list_1 

# View current schema
zed schema read
# View objects and relations
zed relationship read todos/todo 

# Check permissions
zed permission check todos/list:list_1 view todos/user:alice --explain 
```

**Relationship Syntax:**
```bash
# A `todos/list` object can have an `owner` relationship to a `todos/user` object.
zed relationship create todos/list:list_1 owner todos/user:alice

# This will check if user alice can edit todo_1
zed permission check todos/todo:todo_1 edit todos/user:alice --explain
```