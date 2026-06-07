import React from 'react';

interface Props { message?: string }

export default function LoadingSpinner({ message = 'Loading...' }: Props) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
      <div className="spinner-border text-primary" role="status" />
      <span className="text-muted small">{message}</span>
    </div>
  );
}
