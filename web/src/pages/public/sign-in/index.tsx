import { Link } from "react-router";
import { Button } from "../../../core/components/ui/Button";
import { Form, FormField } from "../../../core/components/form-field";
import { SignInSchema, type SignInSchemaType } from "./validate";
import { useAuth } from "../../../core/AuthProvider";

export const SignIn = () => {
  const { login } = useAuth();

  const handleSubmit = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    login(email, password);
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
          <Button type="submit" className="w-full">Sign in</Button>
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
