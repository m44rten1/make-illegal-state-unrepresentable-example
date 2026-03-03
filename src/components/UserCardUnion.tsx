import { useState } from "react";
import { match } from "ts-pattern";
import { useFetchUserUnion } from "../hooks/useFetchUnion";
import { User } from "../types/user";
import "./UserCard.css";

/**
 * CORRECT PATTERN Component: Uses discriminated union + ts-pattern
 *
 * ts-pattern's match().exhaustive() handles each case explicitly.
 * If we forget to handle a case or add a new status, we get a compile error!
 * Each case has access to exactly the data it needs.
 */
export function UserCardUnion() {
  const { state, fetchUser, reset } = useFetchUserUnion();
  const [userId, setUserId] = useState(1);

  const handleFetch = () => {
    fetchUser(userId);
    setUserId((prev) => (prev % 10) + 1); // Cycle through users 1-10
  };

  return (
    <div className="user-card">
      <div className="card-header">
        <span className="badge badge-success">Discriminated Union</span>
        <h3>User Profile</h3>
      </div>
      <div className="card-content">
        {match(state)
          .with({ status: "idle" }, () => <IdleDisplay onFetch={handleFetch} />)
          .with({ status: "loading" }, () => <LoadingSpinner />)
          .with({ status: "error" }, ({ error }) => (
            <ErrorDisplay error={error} onRetry={handleFetch} />
          ))
          .with({ status: "success" }, ({ data }) => (
            <UserDisplay user={data} onFetchAnother={handleFetch} />
          ))
          .exhaustive()}
      </div>
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
