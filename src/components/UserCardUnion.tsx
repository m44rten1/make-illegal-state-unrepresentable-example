import { useState } from "react";
import { useFetchUserUnion } from "../hooks/useFetchUnion";
import { User } from "../types/user";
import "./UserCard.css";

/**
 * CORRECT PATTERN Component: Uses discriminated union for state
 *
 * Notice how the switch statement handles each case explicitly.
 * TypeScript will warn us if we forget to handle a case!
 * Each case has access to exactly the data it needs.
 */
export function UserCardUnion() {
  const { state, fetchUser, reset } = useFetchUserUnion();
  const [userId, setUserId] = useState(1);

  const handleFetch = () => {
    fetchUser(userId);
    setUserId((prev) => (prev % 10) + 1); // Cycle through users 1-10
  };

  // BENEFIT: We use a switch on the discriminant (status)
  // TypeScript ensures we handle all cases.
  // Each case knows exactly what data is available.
  // Impossible states simply don't exist!

  const renderContent = () => {
    switch (state.status) {
      case "idle":
        return <IdleDisplay onFetch={handleFetch} />;

      case "loading":
        return <LoadingSpinner />;

      case "error":
        // TypeScript KNOWS state.error exists here!
        return <ErrorDisplay error={state.error} onRetry={handleFetch} />;

      case "success":
        // TypeScript KNOWS state.data exists here!
        return <UserDisplay user={state.data} onFetchAnother={handleFetch} />;

      // If we add a new status in the future and forget to handle it,
      // TypeScript will give us a compile error here:
      default: {
        const _exhaustive: never = state;
        return _exhaustive;
      }
    }
  };

  return (
    <div className="user-card">
      <div className="card-header">
        <span className="badge badge-success">Discriminated Union</span>
        <h3>User Profile</h3>
      </div>
      <div className="card-content">{renderContent()}</div>
      <div className="card-footer">
        <button className="btn btn-secondary" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}

// Shared UI components (same visual output as Boolean version)

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>Loading user...</p>
    </div>
  );
}

function ErrorDisplay({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  return (
    <div className="error-container">
      <div className="error-icon">!</div>
      <p className="error-message">{error.message}</p>
      <button className="btn btn-primary" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}

function UserDisplay({
  user,
  onFetchAnother,
}: {
  user: User;
  onFetchAnother: () => void;
}) {
  return (
    <div className="user-container">
      <div className="avatar">{user.name.charAt(0)}</div>
      <h4 className="user-name">{user.name}</h4>
      <p className="user-username">@{user.username}</p>
      <div className="user-details">
        <div className="detail-row">
          <span className="detail-label">Email</span>
          <span className="detail-value">{user.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Company</span>
          <span className="detail-value">{user.company.name}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">City</span>
          <span className="detail-value">{user.address.city}</span>
        </div>
      </div>
      <button className="btn btn-primary" onClick={onFetchAnother}>
        Fetch Another User
      </button>
    </div>
  );
}

function IdleDisplay({ onFetch }: { onFetch: () => void }) {
  return (
    <div className="idle-container">
      <div className="idle-icon">?</div>
      <p>Click to fetch a user profile</p>
      <button className="btn btn-primary" onClick={onFetch}>
        Fetch User
      </button>
    </div>
  );
}
