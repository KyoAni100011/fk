import { z } from "zod";
import { isEmpty } from "lodash-es";

export const SignUpSchema = z
  .object({
    email: z.string().email("Email is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (
      data.password !== data.confirmPassword ||
      isEmpty(data.confirmPassword)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Confirm password or password doesn't match",
        path: ["confirmPassword"],
      });
    }
  });

export type SignUpSchemaType = Omit<
  z.infer<typeof SignUpSchema>,
  "confirmPassword"
>;
