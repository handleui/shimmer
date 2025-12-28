package shimmer

import (
	"context"

	tea "github.com/charmbracelet/bubbletea"
)

// Run displays shimmering text until the user presses Ctrl+C, q, or Esc.
// This is a blocking call that handles all Bubble Tea setup.
//
// Example:
//
//	shimmer.Run("Loading", "#00D787")
//
// With options:
//
//	shimmer.Run("Processing", "#FFC000",
//	    shimmer.WithInterval(100*time.Millisecond),
//	    shimmer.WithWaveWidth(12),
//	)
func Run(text, color string, opts ...Option) error {
	return RunContext(context.Background(), text, color, opts...)
}

// RunContext is like Run but accepts a context for cancellation.
func RunContext(ctx context.Context, text, color string, opts ...Option) error {
	m := New(text, color, opts...)
	p := tea.NewProgram(runModel{shimmer: m}, tea.WithContext(ctx))
	_, err := p.Run()
	return err
}

// runModel wraps shimmer.Model for standalone execution.
type runModel struct {
	shimmer Model
}

func (m runModel) Init() tea.Cmd {
	return m.shimmer.Init()
}

func (m runModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "q", "esc":
			return m, tea.Quit
		}
	}

	var cmd tea.Cmd
	m.shimmer, cmd = m.shimmer.Update(msg)
	return m, cmd
}

func (m runModel) View() string {
	return m.shimmer.View()
}

// Spinner provides a builder pattern for running shimmer with a background action.
type Spinner struct {
	text   string
	color  string
	opts   []Option
	action func()
	ctx    context.Context
}

// NewSpinner creates a spinner builder for running shimmer with background work.
//
// Example:
//
//	shimmer.NewSpinner("Installing", "#00D787").
//	    Action(func() { exec.Command("npm", "install").Run() }).
//	    Run()
func NewSpinner(text, color string, opts ...Option) *Spinner {
	return &Spinner{
		text:  text,
		color: color,
		opts:  opts,
		ctx:   context.Background(),
	}
}

// Action sets a function to run while the shimmer animates.
// The shimmer stops when the action completes.
func (s *Spinner) Action(fn func()) *Spinner {
	s.action = fn
	return s
}

// Context sets the context for cancellation.
func (s *Spinner) Context(ctx context.Context) *Spinner {
	s.ctx = ctx
	return s
}

// Run executes the shimmer animation with the configured action.
func (s *Spinner) Run() error {
	if s.action == nil {
		return RunContext(s.ctx, s.text, s.color, s.opts...)
	}

	m := New(s.text, s.color, s.opts...)
	p := tea.NewProgram(
		actionModel{shimmer: m, action: s.action},
		tea.WithContext(s.ctx),
	)
	_, err := p.Run()
	return err
}

// actionModel handles shimmer with a background action.
type actionModel struct {
	shimmer Model
	action  func()
}

type actionDoneMsg struct{}

func (m actionModel) Init() tea.Cmd {
	return tea.Batch(
		m.shimmer.Init(),
		func() tea.Msg {
			m.action()
			return actionDoneMsg{}
		},
	)
}

func (m actionModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case actionDoneMsg:
		return m, tea.Quit
	case tea.KeyMsg:
		if msg.String() == "ctrl+c" {
			return m, tea.Quit
		}
	}

	var cmd tea.Cmd
	m.shimmer, cmd = m.shimmer.Update(msg)
	return m, cmd
}

func (m actionModel) View() string {
	return m.shimmer.View()
}
