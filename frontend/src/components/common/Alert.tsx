import React from 'react';

type Variant = 'success' | 'danger' | 'warning' | 'info';

interface Props {
  variant: Variant;
  message: string;
  onDismiss?: () => void;
}

export default function Alert({ variant, message, onDismiss }: Props) {
  return (
    <div className={`alert alert-${variant} alert-dismissible d-flex align-items-center`} role="alert">
      <span>{message}</span>
      {onDismiss && (
        <button type="button" className="btn-close ms-auto" onClick={onDismiss} aria-label="Close" />
      )}
    </div>
  );
}
