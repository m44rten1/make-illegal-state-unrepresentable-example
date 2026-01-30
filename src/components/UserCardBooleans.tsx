import { useState } from "react";
import { useFetchUserBooleans } from "../hooks/useFetchBooleans";
import { User } from "../types/user";
import "./UserCard.css";

/**
 * ANTI-PATTERN Component: Uses boolean flags for state
 *
 * Notice how we have to manually check multiple conditions
 * and hope we got the order right. The compiler cannot help us
 * ensure we've handled all cases correctly.
 */
export function UserCardBooleans() {
  const { isLoading, isError, data, error, fetchUser, reset } =
    useFetchUserBooleans();
  const [userId, setUserId] = useState(1);

  const handleFetch = () => {
    fetchUser(userId);
    setUserId((prev) => (prev % 10) + 1); // Cycle through users 1-10
  };

  // PROBLEM: We have to manually figure out which "state" we're in
  // by checking multiple booleans in the right order.
  // What if isLoading AND isError are both true? (shouldn't happen, but could!)
  // The compiler won't catch this logic error.

  const renderContent = () => {
    // Check loading first
    if (isLoading) {
      return <LoadingSpinner />;
    }

    // Then check error
    if (isError && error) {
      return <ErrorDisplay error={error} onRetry={handleFetch} />;
    }

    // Then check if we have data
    if (data) {
      return <UserDisplay user={data} onFetchAnother={handleFetch} />;
    }

    // Default: idle state
    return <IdleDisplay onFetch={handleFetch} />;
  };

  return (
    <div className="user-card">
      <div className="card-header">
        <span className="badge badge-danger">Boolean Flags</span>
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

// Shared UI components (same visual output as Union version)

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
