// Run: go run ./_examples/demo
package main

import (
	"fmt"
	"time"

	"github.com/handleui/shimmer"
)

func main() {
	fmt.Println()
	shimmer.NewSpinner("Shimmering", "#00D787").
		Action(func() { time.Sleep(5 * time.Second) }).
		Run()
	fmt.Println()
}
