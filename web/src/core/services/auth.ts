import type { SignInSchemaType } from "../../pages/public/sign-in/validate";
import type { SignUpSchemaType } from "../../pages/public/sign-up/validate";
import {
  FORGOT_PASSWORD,
  LOG_OUT,
  RESET_PASSWORD,
  SIGN_IN,
  SIGN_UP,
  VERIFY_OTP,
} from "../constants/url";
import { api } from "../libs/axios";

export const signIn = async (data: SignInSchemaType) => {
  const result = await api.post(SIGN_IN, data);

  return result.data;
};

export const signUp = async (data: SignUpSchemaType) => {
  const result = await api.post(SIGN_UP, data);

  return result.data;
};

export const logOut = async () => {
  const result = await api.post(LOG_OUT);

  return result.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const result = await api.post(FORGOT_PASSWORD, data);

  return result.data;
};

export const verifyOTP = async (data: { email: string; code: string }) => {
  const result = await api.post(VERIFY_OTP, data);

  return result.data;
};

export const resetPassword = async (data: { newPassword: string }) => {
  const result = await api.post(RESET_PASSWORD, data);

  return result.data;
};
