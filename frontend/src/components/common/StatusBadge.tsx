import React from 'react';

interface Props { status: string }

const statusMap: Record<string, string> = {
  Pending:    'secondary',
  Dispatched: 'primary',
  InTransit:  'info',
  Delivered:  'success',
  Cancelled:  'danger',
};

export default function StatusBadge({ status }: Props) {
  const variant = statusMap[status] || 'secondary';
  return <span className={`badge bg-${variant}`}>{status}</span>;
}
