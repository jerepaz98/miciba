import { Appointment } from '../types';
import { AppNotification } from '../types/notification';
import { parseAppointmentDateTime } from '../utils/date';

export const buildBaseNotifications = (now = Date.now()): AppNotification[] => [
  {
    id: 'base-1',
    title: 'Recordatorio de turnos',
    message: 'Podés revisar tus turnos confirmados desde Mis turnos.',
    timeLabel: 'Hace 10 min',
    createdAt: now - 10 * 60 * 1000,
    kind: 'appointment_reminder'
  },
  {
    id: 'base-2',
    title: 'Aún no tenés turnos',
    message: 'Reservá uno cuando quieras para recibir recordatorios automáticos.',
    timeLabel: 'Ayer',
    createdAt: now - 26 * 60 * 60 * 1000,
    kind: 'appointment_updated'
  }
];

export const buildAppointmentNotifications = (appointments: Appointment[], now = Date.now()): AppNotification[] => {
  if (!appointments.length) {
    return [];
  }

  const notifications: AppNotification[] = [];

  appointments.forEach((appointment, index) => {
    const parsedDate = parseAppointmentDateTime(appointment.date, appointment.time);

    // Confirmación inicial del turno.
    notifications.push({
      id: `confirmed-${appointment.id}`,
      title: 'Turno confirmado',
      message: `Tu turno con ${appointment.doctorName} fue confirmado para el ${appointment.date} a las ${appointment.time}.`,
      timeLabel: 'Hace 1 h',
      createdAt: now - (index + 1) * 60 * 60 * 1000,
      kind: 'appointment_confirmed',
      appointmentId: appointment.id
    });

    if (parsedDate && parsedDate.getTime() >= now) {
      notifications.push({
        id: `reminder-${appointment.id}`,
        title: 'Recordatorio de turno',
        message: `Tenés una cita con ${appointment.doctorName} el ${appointment.date} a las ${appointment.time}.`,
        timeLabel: 'Próximo',
        createdAt: now - (index + 1) * 20 * 60 * 1000,
        kind: 'appointment_reminder',
        appointmentId: appointment.id
      });
    }
  });

  const first = appointments[0];
  if (first) {
    notifications.push({
      id: `updated-${first.id}`,
      title: 'Cambio de horario',
      message: `Tu turno con ${first.doctorName} tuvo una actualización reciente.`,
      timeLabel: 'Hace 2 h',
      createdAt: now - 2 * 60 * 60 * 1000,
      kind: 'appointment_updated',
      appointmentId: first.id
    });
    notifications.push({
      id: `cancelled-${first.id}`,
      title: 'Turno cancelado',
      message: `Se canceló un turno anterior con ${first.doctorName}. Podés reprogramarlo desde Mis turnos.`,
      timeLabel: 'Ayer',
      createdAt: now - 28 * 60 * 60 * 1000,
      kind: 'appointment_cancelled',
      appointmentId: first.id
    });
  }

  return notifications;
};
