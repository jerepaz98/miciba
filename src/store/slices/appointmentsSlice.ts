import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment } from '../../types';

type AppointmentsState = {
  appointments: Appointment[];
};

const initialState: AppointmentsState = {
  appointments: []
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments = [action.payload, ...state.appointments];
    },
    markAsSynced: (state, action: PayloadAction<{ id: string; firebaseId: string }>) => {
      const target = state.appointments.find((item) => item.id === action.payload.id);
      if (target) {
        target.pendingSync = 0;
        target.status = 'synced';
        target.firebaseId = action.payload.firebaseId;
      }
    }
  }
});

export const { setAppointments, addAppointment, markAsSynced } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;