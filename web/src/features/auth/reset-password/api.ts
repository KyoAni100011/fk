import { FORGOT_PASSWORD, VERIFY_OTP, RESET_PASSWORD } from "../../../core/config/url";
import { api } from "../../../core/api/client";

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
