# Shimmer

A terminal shimmer text animation for Go, built on [Bubble Tea](https://github.com/charmbracelet/bubbletea) and [Lip Gloss](https://github.com/charmbracelet/lipgloss).

A wave of brightened color sweeps across text, creating a modern loading indicator.

## Install

```bash
go get github.com/handleui/shimmer
```

## Usage

```go
package main

import (
    "github.com/handleui/shimmer"
    tea "github.com/charmbracelet/bubbletea"
)

type model struct {
    shimmer shimmer.Model
}

func (m model) Init() tea.Cmd {
    return m.shimmer.Init()
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    var cmd tea.Cmd
    m.shimmer, cmd = m.shimmer.Update(msg)
    return m, cmd
}

func (m model) View() string {
    return m.shimmer.View()
}

func main() {
    m := model{
        shimmer: shimmer.New("Loading...", "#00D787"),
    }
    tea.NewProgram(m).Run()
}
```

## Configuration

Use functional options to customize the shimmer:

```go
shimmer.New("Loading...", "#FFC000",
    shimmer.WithInterval(100 * time.Millisecond), // Animation speed
    shimmer.WithPeakLight(80),                    // Max brightness (0-100)
    shimmer.WithWaveWidth(12),                    // Wave size in characters
    shimmer.WithWavePause(4),                     // Pause between loops
    shimmer.WithDirection(shimmer.DirectionLeft), // Wave direction
)
```

### Defaults

| Option | Default | Description |
|--------|---------|-------------|
| Interval | 50ms | Time between animation frames |
| PeakLight | 90 | Maximum lightness percentage |
| WaveWidth | 8 | Characters in the wave |
| WavePause | 8 | Pause between wave loops |
| Direction | Right | Wave moves left to right |

## Methods

```go
// Update text while animating
m = m.SetText("New text...")

// Stop/start animation
m = m.SetLoading(false)
m = m.SetLoading(true)
```

## Why

Inspired by [termcast](https://github.com/remorses/termcast)'s shimmer effect. Built as a zero-dependency Bubble Tea component for modern terminal UIs.

## License

MIT
