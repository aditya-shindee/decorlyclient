"use client";

import { useState, Suspense } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Link from "next/link";

// Google SVG Icon Component
const GoogleIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Create a client component that uses useSearchParams
function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", { isLoaded, email });
    if (!isLoaded) {
      console.log("Clerk not loaded yet");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting to sign in with Clerk");
      const result = await signIn.create({
        identifier: email,
        password,
      });
      console.log("Sign in result:", result);

      if (result.status === "complete") {
        console.log("Sign in complete, setting active session");
        await setActive({ session: result.createdSessionId });
        console.log("Redirecting to:", redirectUrl);
        router.push(redirectUrl);
      } else {
        console.error("Sign-in status:", result.status);
        setError("Sign-in process requires additional steps not handled in this example.");
      }
    } catch (err: any) {
      console.error("Sign-in error:", JSON.stringify(err, null, 2));
      const firstError = err.errors?.[0];
      if (firstError) {
        if (firstError.code === "form_identifier_not_found") {
          setError("Invalid email or password. Please try again.");
        } else if (firstError.code === "form_password_incorrect") {
          setError("Invalid email or password. Please try again.");
        } else if (firstError.code === "session_exists") {
          setError("You are already signed in.");
        } else {
          setError(firstError.longMessage || firstError.message || "An error occurred during sign in.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log("Google sign in clicked", { isLoaded });
    if (!isLoaded) {
      console.log("Clerk not loaded yet");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting Google OAuth redirect");
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: redirectUrl,
      });
      console.log("Google OAuth redirect initiated");
    } catch (err: any) {
      console.error("Google sign in error:", err);
      setError(err.errors?.[0]?.message || "An error occurred with Google sign in");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="flex w-full max-w-4xl mx-auto shadow-2xl rounded-xl overflow-hidden">
        {/* Left Panel: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
            <p className="text-gray-600 mb-8">Login to your Decorly account</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Demo Account</h3>
            <div className="bg-white border border-gray-200 rounded p-3">
              <div className="font-mono text-sm text-gray-800">
                <div>email:aditya12081998@gmail.com</div>
                <div className="mt-1">password:bolt_hackathon</div>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 text-red-700">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full border-2 border-gray-300 focus:ring-black focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="m@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {/* <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link> */}
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full border-2 border-gray-300 focus:ring-black focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50 text-gray-700"
            onClick={() => handleGoogleSignIn()}
            disabled={isLoading}
          >
            <GoogleIcon />
            <span className="font-medium">Continue with Google</span>
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Panel: Image Placeholder */}
        <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center p-0">
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src="https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/static-images//staticlogin.png" 
              alt="Placeholder" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-4 max-w-4xl w-full">
        By clicking continue, you agree to our <a href="#" className="underline underline-offset-4">Terms of Service</a> and <a href="#" className="underline underline-offset-4">Privacy Policy</a>.
      </div>
    </div>
  );
}

// Main page component
export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
