import { UserCardBooleans } from "./components/UserCardBooleans";
import { UserCardUnion } from "./components/UserCardUnion";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Make Illegal State Unrepresentable</h1>
        <p className="subtitle">
          A practical demonstration of why discriminated unions are better than
          boolean flags
        </p>
      </header>

      <section className="explanation">
        <div className="problem">
          <h2>The Problem</h2>
          <p>
            Using multiple booleans like <code>isLoading</code>,{" "}
            <code>isError</code>, and checking <code>data !== null</code>{" "}
            creates <strong>16 possible combinations</strong>, but only 4 are
            valid states.
          </p>
          <pre className="code-block">{`// Anti-pattern: What does this state mean?
{
  isLoading: true,
  isError: true,   // Loading AND error?
  data: user,      // Have data while loading?
  error: err       // Have error object too?
}`}</pre>
        </div>

        <div className="solution">
          <h2>The Solution</h2>
          <p>
            A discriminated union with a <code>status</code> field allows{" "}
            <strong>only 4 valid states</strong>. TypeScript enforces exhaustive
            handling and provides correct types in each branch.
          </p>
          <pre className="code-block">{`// Correct: Only valid states exist
type State<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };`}</pre>
        </div>
      </section>

      <section className="comparison">
        <h2>Live Comparison</h2>
        <p className="comparison-note">
          Both cards fetch from the same API and have identical UIs. The
          difference is in the code structure and type safety. (30% chance of
          simulated error to demonstrate error handling)
        </p>
        <div className="cards-grid">
          <UserCardBooleans />
          <UserCardUnion />
        </div>
      </section>

      <section className="benefits">
        <h2>Why This Matters</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>Compile-Time Safety</h3>
            <p>
              Invalid states simply cannot be represented. You can't
              accidentally set <code>isLoading: true</code> and{" "}
              <code>isError: true</code> simultaneously.
            </p>
          </div>
          <div className="benefit-card">
            <h3>Exhaustive Handling</h3>
            <p>
              TypeScript warns you if you forget to handle a state. Add a new
              status? The compiler shows you every place that needs updating.
            </p>
          </div>
          <div className="benefit-card">
            <h3>Self-Documenting</h3>
            <p>
              The type definition shows exactly what states are possible. No
              need to trace through code to understand valid combinations.
            </p>
          </div>
          <div className="benefit-card">
            <h3>Narrowing</h3>
            <p>
              In each switch case, TypeScript knows exactly what properties
              exist.
              <code>state.data</code> is guaranteed to exist when{" "}
              <code>status === 'success'</code>.
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>
          This pattern applies beyond fetch states: form validation,
          authentication, payment processing, wizard steps, and any state
          machine.
        </p>
      </footer>
    </div>
  );
}

export default App;
