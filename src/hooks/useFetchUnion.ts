import { useState, useCallback } from "react";
import { User, UnionFetchState } from "../types/user";

const API_URL = "https://jsonplaceholder.typicode.com/users";

/**
 * CORRECT PATTERN: Discriminated Union fetch state
 *
 * This hook demonstrates the proper approach using a discriminated union.
 *
 * BENEFITS:
 * 1. IMPOSSIBLE to have loading AND error simultaneously - the type won't allow it
 * 2. Each state carries only the data relevant to that state
 * 3. TypeScript FORCES exhaustive handling with switch statements
 * 4. No way to "forget" to update a flag - you set the entire state at once
 * 5. Self-documenting: the type tells you exactly what states are possible
 */
export function useFetchUserUnion() {
  const [state, setState] = useState<UnionFetchState<User>>({ status: "idle" });

  const fetchUser = useCallback(async (userId: number) => {
    // Set to loading - this is the ONLY valid loading state
    // No other properties to worry about!
    setState({ status: "loading" });

    try {
      // Simulate network delay for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Randomly fail 30% of the time to demonstrate error state
      if (Math.random() < 0.3) {
        throw new Error("Random network failure (simulated for demo)");
      }

      const response = await fetch(`${API_URL}/${userId}`);

      if (!response.ok) {
        throw new Error(`User not found (status: ${response.status})`);
      }

      const user: User = await response.json();

      // Success state - TypeScript KNOWS data exists here
      // You cannot set status: 'success' without providing data
      setState({ status: "success", data: user });
    } catch (err) {
      // Error state - TypeScript KNOWS error exists here
      // You cannot set status: 'error' without providing error
      setState({
        status: "error",
        error: err instanceof Error ? err : new Error("Unknown error"),
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle" });
  }, []);

  return {
    state,
    fetchUser,
    reset,
  };
}
