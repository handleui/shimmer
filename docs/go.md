# Shimmer for Go

Shimmering text for terminals. Built on [Bubble Tea](https://github.com/charmbracelet/bubbletea).

## Install

```bash
go get github.com/handleui/shimmer
```

## Usage

```go
shimmer.Run("Loading", "#00D787")
```

### With background task

```go
shimmer.NewSpinner("Installing", "#00D787").
    Action(func() { exec.Command("npm", "install").Run() }).
    Run()
```

### With context

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()
shimmer.RunContext(ctx, "Loading", "#00D787")
```

## API

### Functions

| Function | Description |
|----------|-------------|
| `Run(text, color, opts...)` | Display shimmer until Ctrl+C |
| `RunContext(ctx, text, color, opts...)` | Display shimmer with context |
| `New(text, color, opts...)` | Create Bubble Tea component |
| `NewSpinner(text, color, opts...)` | Create spinner with action |

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `WithInterval(time.Duration)` | 50ms | Animation speed |
| `WithWaveWidth(int)` | 8 | Wave size in characters |
| `WithWavePause(int)` | 8 | Pause between loops |
| `WithPeakLight(int)` | 90 | Brightness 0-100 |
| `WithDirection(Direction)` | Right | `DirectionLeft` or `DirectionRight` |

### Bubble Tea

```go
m := shimmer.New("Loading", "#00D787")
m.Init()              // start animation
m.Update(msg)         // handle ticks
m.View()              // render
m.SetText("Done")     // change text
m.SetLoading(false)   // stop animation
```

## Demo

```bash
go run ./_examples/demo
```
