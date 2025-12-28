# Shimmer

Shimmering text for your terminal. A wave of light sweeps across your text.

Built this for [handleui/detent](https://github.com/handleui/detent) but it works anywhere.

## Install

```bash
go get github.com/handleui/shimmer
```

## Usage

```go
shimmer.Run("Loading...", "#00D787")
```

That's it.

### With a task

```go
shimmer.NewSpinner("Installing...", "#00D787").
    Action(func() { exec.Command("npm", "install").Run() }).
    Run()
```

### Options

```go
shimmer.WithInterval(100 * time.Millisecond) // speed
shimmer.WithWaveWidth(12)                    // wave size
shimmer.WithDirection(shimmer.DirectionLeft) // direction
```

### Bubble Tea

Works as a component too. See [shimmer.go](shimmer.go) for the `Model` interface.

## Demo

```bash
go run ./_examples/demo
```
