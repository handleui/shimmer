# Shimmer

Shimmering text for terminals.

## Install

| Language | Package |
|----------|---------|
| Go | `go get github.com/handleui/shimmer` |
| TypeScript | `npm install @handleui/shimmer` |

## Usage

### Go

```go
shimmer.Run("Loading", "#00D787")
```

### TypeScript

```ts
import { run } from "@handleui/shimmer";
run("Loading", "#00D787");
```

## Docs

- [Go](./docs/go.md)
- [TypeScript](./ts/README.md)

## Demo

```bash
# Go
go run ./_examples/demo

# TypeScript
cd ts && npm run demo
```
