// User type from JSONPlaceholder API
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

// ============================================================================
// ANTI-PATTERN: Boolean-based state
// ============================================================================
// Problem: 2^4 = 16 possible combinations of these booleans,
// but only 4 states are actually valid!
//
// Invalid states that TypeScript CANNOT prevent:
// - isLoading: true, isError: true (loading AND error at same time?)
// - isLoading: true, data: User (loading but already have data?)
// - isError: false, error: Error (no error flag but have error object?)
// - isLoading: false, isError: false, data: null (not loading, no error, no data?)
//
export interface BooleanFetchState<T> {
  isLoading: boolean;
  isError: boolean;
  data: T | null;
  error: Error | null;
}

// ============================================================================
// CORRECT PATTERN: Discriminated Union
// ============================================================================
// Only 4 possible states - ALL of them are valid!
// TypeScript enforces that you handle each case.
// Impossible to have contradictory state.
//
export type UnionFetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; data: T };
