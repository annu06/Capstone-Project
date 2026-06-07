import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../../api/notification.api';
import { useNotifications } from '../../contexts/NotificationContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function NotificationsPage() {
  const qc = useQueryClient();
  const { resetUnread } = useNotifications();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list().then((r) => r.data.data),
    onSuccess: () => resetUnread(),
  } as any);

  const markAllMutation = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markOneMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const notifications = (data as any[]) || [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Notifications</h4>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => markAllMutation.mutate()}
          disabled={markAllMutation.isPending}
        >
          Mark All Read
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : notifications.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5 text-muted">
            <div className="fs-1 mb-2">🔔</div>
            No notifications yet.
          </div>
        </div>
      ) : (
        <div className="list-group">
          {notifications.map((n: any) => (
            <div
              key={n.id}
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-start ${!n.isRead ? 'list-group-item-light border-start border-primary border-3' : ''}`}
            >
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge bg-secondary small">{n.notificationType}</span>
                  {!n.isRead && <span className="badge bg-primary">New</span>}
                </div>
                <div>{n.message}</div>
                {n.trackingId && (
                  <div className="small text-muted mt-1">Tracking: <code>{n.trackingId}</code></div>
                )}
                <div className="small text-muted">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              {!n.isRead && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => markOneMutation.mutate(n.id)}
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
