import axios from "axios";
import { FIREBASE_API_KEY } from "./config";

const authApi = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1",
});

type AuthResponse = {
  idToken: string;
  email: string;
  localId: string;
  expiresIn: string;
};

// ✅ Registro
export const signup = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await authApi.post(`/accounts:signUp?key=${FIREBASE_API_KEY}`, {
      email,
      password,
      returnSecureToken: true,
    });
    return response.data;
  } catch (err: any) {
    console.log("FIREBASE SIGNUP ERROR:", err?.response?.status, err?.response?.data);
    throw err;
  }
};

// ✅ Login
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await authApi.post(`/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
      email,
      password,
      returnSecureToken: true,
    });
    return response.data;
  } catch (err: any) {
    console.log("FIREBASE LOGIN ERROR:", err?.response?.status, err?.response?.data);
    throw err;
  }
};

// Alias si ya los usás así en el resto del proyecto
export const signUp = signup;
export const signIn = login;
