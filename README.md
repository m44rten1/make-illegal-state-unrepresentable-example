# Make Illegal State Unrepresentable

A practical React + TypeScript demonstration of the "make illegal state unrepresentable" principle.

## The Problem

When managing async state with boolean flags, you create **impossible state combinations**:

```typescript
interface FetchState {
  isLoading: boolean;
  isError: boolean;
  data: User | null;
  error: Error | null;
}

// 2^4 = 16 possible combinations, but only 4 are valid!
// What does this even mean?
{
  isLoading: true,
  isError: true,
  data: someUser,
  error: someError
}
```

TypeScript cannot prevent these invalid states. Your code must handle combinations that should never exist, leading to bugs and confusion.

## The Solution

Use a **discriminated union** where only valid states can be represented:

```typescript
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; data: T };
```

Now there are exactly **4 possible states**, all valid. TypeScript enforces:

- You cannot be loading AND have an error
- You cannot access `data` unless status is `'success'`
- You cannot access `error` unless status is `'error'`
- Exhaustive switch statements catch missing cases at compile time

## This Demo

This repo contains two identical-looking React components that fetch user data from an API:

| Component          | Approach               | Type Safety                |
| ------------------ | ---------------------- | -------------------------- |
| `UserCardBooleans` | Multiple boolean flags | Allows invalid states      |
| `UserCardUnion`    | Discriminated union    | Only valid states possible |

Both components:

- Fetch from JSONPlaceholder API
- Show loading spinner
- Display error with retry button
- Show user card on success

The difference is in the code structure and type safety guarantees.

## Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Key Files

```
src/
├── types/user.ts              # Both state type definitions
├── hooks/
│   ├── useFetchBooleans.ts    # Boolean flag approach (anti-pattern)
│   └── useFetchUnion.ts       # Discriminated union (recommended)
└── components/
    ├── UserCardBooleans.tsx   # Uses boolean flags
    └── UserCardUnion.tsx      # Uses discriminated union
```

## Why This Matters

| Benefit                 | Description                                                     |
| ----------------------- | --------------------------------------------------------------- |
| **Compile-time safety** | Invalid states are unrepresentable, not just "shouldn't happen" |
| **Exhaustive handling** | Add a new state? Compiler shows every place needing updates     |
| **Type narrowing**      | In each branch, TypeScript knows exactly what properties exist  |
| **Self-documenting**    | The type definition is the source of truth for possible states  |

## Beyond Fetch State

This pattern applies to many domains:

- **Form validation**: `pristine | touched | validating | valid | invalid`
- **Authentication**: `anonymous | authenticating | authenticated | expired`
- **Payments**: `idle | processing | succeeded | failed | refunded`
- **Wizards**: `step1 | step2 | step3 | complete`

## Further Reading

- [Making Impossible States Impossible](https://www.youtube.com/watch?v=IcgmSRJHu_8) - Elm Conf talk by Richard Feldman
- [Designing with Types: Making Illegal States Unrepresentable](https://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/) - F# for Fun and Profit
