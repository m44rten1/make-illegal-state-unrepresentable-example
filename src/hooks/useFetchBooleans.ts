import { useState, useCallback } from "react";
import { User, BooleanFetchState } from "../types/user";

const API_URL = "https://jsonplaceholder.typicode.com/users";

/**
 * ANTI-PATTERN: Boolean-based fetch state
 *
 * This hook demonstrates the problematic approach of using multiple
 * independent booleans to track async state.
 *
 * PROBLEMS:
 * 1. Nothing prevents setting isLoading=true AND isError=true simultaneously
 * 2. We could have data AND error at the same time
 * 3. The consumer must check multiple flags in the correct order
 * 4. Easy to forget to reset all flags, leading to bugs
 * 5. No compile-time guarantee of valid state
 */
export function useFetchUserBooleans() {
  const [state, setState] = useState<BooleanFetchState<User>>({
    isLoading: false,
    isError: false,
    data: null,
    error: null,
  });

  const fetchUser = useCallback(async (userId: number) => {
    // Reset state - but what if we forget to reset isError?
    // The compiler won't catch it!
    setState({
      isLoading: true,
      isError: false,
      data: null,
      error: null,
    });

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

      // BUG POTENTIAL: What if we set data but forget to set isLoading to false?
      // TypeScript cannot help us here!
      setState({
        isLoading: false,
        isError: false,
        data: user,
        error: null,
      });
    } catch (err) {
      // BUG POTENTIAL: We could accidentally leave isLoading: true here
      // and TypeScript would be perfectly fine with it
      setState({
        isLoading: false,
        isError: true,
        data: null,
        error: err instanceof Error ? err : new Error("Unknown error"),
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isError: false,
      data: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    fetchUser,
    reset,
  };
}
