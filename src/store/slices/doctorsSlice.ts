import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Doctor } from '../../types';

const categories = ['All', 'Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'General'];

type DoctorsState = {
  doctors: Doctor[];
  categories: string[];
  selectedDoctor: Doctor | null;
};

const initialState: DoctorsState = {
  doctors: [],
  categories,
  selectedDoctor: null
};

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setDoctors: (state, action: PayloadAction<Doctor[]>) => {
      state.doctors = action.payload;
    },
    setSelectedDoctor: (state, action: PayloadAction<Doctor | null>) => {
      state.selectedDoctor = action.payload;
    }
  }
});

export const { setDoctors, setSelectedDoctor } = doctorsSlice.actions;
export default doctorsSlice.reducer;