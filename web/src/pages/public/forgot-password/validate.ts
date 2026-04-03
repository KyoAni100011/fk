import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Email is required"),
});

export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;

export const VerifyOTPSchema = z.object({
  code: z.string().length(6, "OTP must be 6 digits"),
});

export type VerifyOTPSchemaType = z.infer<typeof VerifyOTPSchema>;

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
