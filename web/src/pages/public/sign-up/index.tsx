import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../../../core/components/ui/Button";
import { Form, FormField } from "../../../core/components/form-field";
import { SignUpSchema, type SignUpSchemaType } from "./validate";
import { defaultValueSignUpForm } from "./constants";
import { useAuth } from "../../../core/AuthProvider";

export const SignUp = () => {
  const { register } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    setIsSubmitting(true);
    await register(username, email, password);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold mb-3">Sign Up</h1>
      <Form<SignUpSchemaType>
        onSubmit={handleSubmit}
        defaultValues={defaultValueSignUpForm}
        schema={SignUpSchema}
      >
        <FormField id="username" label="Username" />
        <FormField id="email" label="Email" type="email" />
        <FormField id="password" label="Password" type="password" />
        <FormField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
        />
        <div className="text-right mb-3">
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            {isSubmitting ? "Signing up..." : "Sign up"}
          </Button>
        </div>
      </Form>
      <div className="text-xs text-center">
        <p className="inline-block mr-1">Already have account?</p>
        <Link
          className="text-xs hover:underline hover:text-blue-700 font-bold"
          to="/sign-in"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};
