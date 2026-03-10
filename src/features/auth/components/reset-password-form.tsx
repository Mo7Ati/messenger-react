import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import notSelectedChat from "../../../assets/not-selected-chat.svg";
import { useState, useEffect } from "react";
import { NavLink, useParams, useSearchParams } from "react-router";
import { useAuth } from "@/features/auth/auth-context";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type ResetFormData = {
  email: string;
  password: string;
  password_confirmation: string;
};

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { token } = useParams();
  const [searchParams] = useSearchParams();

  const emailFromUrl = searchParams.get("email") ?? "";

  const [data, setData] = useState<ResetFormData>({
    email: emailFromUrl,
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { resetPassword } = useAuth();

  useEffect(() => {
    setData((prev) => ({ ...prev, email: emailFromUrl }));
  }, [emailFromUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing reset link. Request a new one.");
      return;
    }
    if (data.password !== data.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await resetPassword(
        data.email,
        token,
        data.password,
        data.password_confirmation
      );
      setSuccess(true);
      toast.success("Password reset successfully");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Failed to reset password";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="flex flex-col justify-center gap-6 p-6 md:p-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Password reset</h1>
                <p className="text-muted-foreground text-balance">
                  Your password has been reset. You can now log in with your new
                  password.
                </p>
              </div>
              <Field>
                <Button asChild className="w-full">
                  <NavLink to="/login">Log in</NavLink>
                </Button>
              </Field>
            </div>
            <div className="bg-muted relative hidden md:block">
              <img
                src={notSelectedChat}
                alt=""
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="flex flex-col justify-center gap-6 p-6 md:p-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Invalid reset link</h1>
                <p className="text-muted-foreground text-balance">
                  This password reset link is invalid or has expired. Please
                  request a new one.
                </p>
              </div>
              <FieldDescription className="text-center">
                <NavLink to="/forgot-password" className="underline underline-offset-4">
                  Request new reset link
                </NavLink>
              </FieldDescription>
            </div>
            <div className="bg-muted relative hidden md:block">
              <img
                src={notSelectedChat}
                alt=""
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Reset your password</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your new password below.
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={data.email}
                  required
                  onChange={(e) =>
                    setData({ ...data, email: e.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password_confirmation">
                  Confirm password
                </FieldLabel>
                <Input
                  id="password_confirmation"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={data.password_confirmation}
                  onChange={(e) =>
                    setData({ ...data, password_confirmation: e.target.value })
                  }
                />
              </Field>
              {error && (
                <p className="text-destructive text-sm" role="alert">
                  {error}
                </p>
              )}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                <NavLink to="/login">Back to login</NavLink>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src={notSelectedChat}
              alt=""
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
