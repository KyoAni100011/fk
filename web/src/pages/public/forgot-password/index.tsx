import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../../../core/components/ui/Button";
import { Form, FormField } from "../../../core/components/form-field";
import {
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../../../core/services/auth";
import {
  ForgotPasswordSchema,
  type ForgotPasswordSchemaType,
  VerifyOTPSchema,
  type VerifyOTPSchemaType,
  ResetPasswordSchema,
  type ResetPasswordSchemaType,
} from "./validate";
import { useAlert } from "../../../core/AlertContext";

export const ForgotPassword = () => {
  const { showAlert } = useAlert();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async (data: ForgotPasswordSchemaType) => {
    setLoading(true);
    setError("");
    try {
      await forgotPassword(data);
      setEmail(data.email);
      setStep("otp");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (data: VerifyOTPSchemaType) => {
    setLoading(true);
    setError("");
    try {
      await verifyOTP({ email, code: data.code });
      setStep("reset");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (data: ResetPasswordSchemaType) => {
    setLoading(true);
    setError("");
    try {
      await resetPassword({ newPassword: data.password });
      showAlert("Password reset successfully! Please log in.", "Success");
      navigate("/sign-in");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold mb-3">
        {step === "email" && "Forgot Password?"}
        {step === "otp" && "Verify OTP"}
        {step === "reset" && "Secure Account"}
      </h1>
      <p className="text-xs mb-3">
        {step === "email" && "Enter your email to receive a recovery code."}
        {step === "otp" && `We've sent a 6-digit code to ${email}`}
        {step === "reset" && "Create a strong new password for your account."}
      </p>

      {error && (
        <div className="text-red-500 text-xs mb-3">
          {error}
        </div>
      )}

      {step === "email" && (
        <Form<ForgotPasswordSchemaType>
          schema={ForgotPasswordSchema}
          onSubmit={handleEmailSubmit}
          defaultValues={{ email: "" }}
        >
          <FormField
            id="email"
            label="Email Address"
            type="email"
            placeholder="name@company.com"
          />
          <div className="text-right mb-3">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              isLoading={loading}
            >
              Send Recovery Code
            </Button>
          </div>
        </Form>
      )}

      {step === "otp" && (
        <Form<VerifyOTPSchemaType>
          schema={VerifyOTPSchema}
          onSubmit={handleOTPSubmit}
          defaultValues={{ code: "" }}
        >
          <FormField
            id="code"
            label="Verification Code"
            type="text"
            placeholder="Enter 6-digit code"
            maxLength={6}
          />
          <div className="text-right mb-3">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              isLoading={loading}
            >
              Verify & Continue
            </Button>
          </div>
          <div className="text-right mb-3">
            <button
              type="button"
              onClick={() => setStep("email")}
              className="text-xs hover:underline hover:text-blue-700"
            >
              Change email address?
            </button>
          </div>
        </Form>
      )}

      {step === "reset" && (
        <Form<ResetPasswordSchemaType>
          schema={ResetPasswordSchema}
          onSubmit={handleResetSubmit}
          defaultValues={{ password: "", confirmPassword: "" }}
        >
          <FormField
            id="password"
            label="New Password"
            type="password"
            placeholder="••••••••"
          />
          <FormField
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
          />
          <div className="text-right mb-3">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              isLoading={loading}
            >
              Reset Password
            </Button>
          </div>
        </Form>
      )}

      <div className="text-xs text-center mt-3">
        <p className="inline-block mr-1">Remember your password?</p>
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
