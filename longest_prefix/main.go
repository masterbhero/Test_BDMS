package main

import (
	"fmt"
	"strings"
)

func main() {
	strs1 := []string{"flower", "flow", "flight"}
	fmt.Println(findPrefix(strs1))
	strs2 := []string{"dog", "racecar", "car"}
	fmt.Println(findPrefix(strs2))
}

func findPrefix(strs []string) string {
	check := strs[0]
	for i := 1; i < len(strs); i++ {
		for !strings.HasPrefix(strs[i], check) {
			check = check[:len(check)-1]
		}
	}
	return check
}
