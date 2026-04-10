import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../../../shared/ui/Button";
import { Form, FormField } from "../../../shared/ui/FormField";
import { SignInSchema, type SignInSchemaType } from "./validator";
import { useAuth } from "../../../app/providers/AuthProvider";

export const SignIn = () => {
  const { login } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsSubmitting(true);
    await login(email, password);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold mb-3">Sign In</h1>
      <Form<SignInSchemaType>
        onSubmit={handleSubmit}
        defaultValues={{
          email: "",
          password: "",
        }}
        schema={SignInSchema}
      >
        <FormField id="email" label="Email" type="text" required />
        <FormField id="password" label="Password" type="password" required />
        <div className="text-right mb-3">
          <Link
            className="text-xs hover:underline hover:text-blue-700"
            to="/forgot-password"
          >
            Forgot password ?
          </Link>
        </div>
        <div className="text-right mb-3">
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </div>
        <div className="text-xs text-center">
          <p className="inline-block mr-1">Don't have account?</p>
          <Link
            className="text-xs hover:underline hover:text-blue-700 font-bold"
            to="/sign-up"
          >
            Sign up
          </Link>
        </div>
      </Form>
    </div>
  );
};
