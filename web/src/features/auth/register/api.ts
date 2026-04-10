import { SIGN_UP } from "../../../core/config/url";
import { api } from "../../../core/api/client";
import type { SignUpSchemaType } from "./validator";

export const signUp = async (data: SignUpSchemaType) => {
  const result = await api.post(SIGN_UP, data);
  return result.data;
};
