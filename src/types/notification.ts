export type NotificationKind =
  | 'appointment_confirmed'
  | 'appointment_reminder'
  | 'appointment_updated'
  | 'appointment_cancelled';

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  timeLabel: string;
  createdAt: number;
  kind: NotificationKind;
  appointmentId?: string;
  isRead?: boolean;
};
