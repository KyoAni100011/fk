import { SIGN_IN, LOG_OUT } from "../../../core/config/url";
import { api } from "../../../core/api/client";
import type { SignInSchemaType } from "./validator";

export const signIn = async (data: SignInSchemaType) => {
  const result = await api.post(SIGN_IN, data);
  return result.data;
};

export const logOut = async () => {
  const result = await api.post(LOG_OUT);
  return result.data;
};
