// Run: go run ./_examples/demo
package main

import (
	"time"

	"github.com/handleui/shimmer"
)

func main() {
	shimmer.NewSpinner("Shimmering...", "#00D787").
		Action(func() { time.Sleep(5 * time.Second) }).
		Run()
}
