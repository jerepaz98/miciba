import axios from 'axios';
import { firebaseConfig } from './config';

const authApi = axios.create({
  baseURL: firebaseConfig.authUrl
});

type AuthResponse = {
  idToken: string;
  email: string;
  localId: string;
  expiresIn: string;
};

export const signup = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await authApi.post(`/accounts:signUp?key=${firebaseConfig.apiKey}`, {
    email,
    password,
    returnSecureToken: true
  });
  return response.data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await authApi.post(`/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`, {
    email,
    password,
    returnSecureToken: true
  });
  return response.data;
};

export const signUp = signup;
export const signIn = login;