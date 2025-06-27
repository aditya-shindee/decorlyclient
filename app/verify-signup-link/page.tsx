"use client";

import { useEffect, useState, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Create a client component that uses useSearchParams
function VerifySignUpForm() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success">("loading");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      // User is already signed in, verification was successful
      setVerificationStatus("success");
      setTimeout(() => {
        router.push(redirectUrl);
      }, 2000);
    } else {
      // If not signed in after a delay, something went wrong
      setTimeout(() => {
        if (!isSignedIn) {
          router.push(`/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`);
        }
      }, 5000);
    }
  }, [isLoaded, isSignedIn, user, router, redirectUrl]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            {verificationStatus === "loading" && (
              <>
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing verification</h2>
                <p className="text-gray-600">Please wait while we complete your account setup...</p>
              </>
            )}

            {verificationStatus === "success" && (
              <>
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome!</h2>
                <p className="text-gray-600 mb-4">
                  Your account has been verified successfully. Redirecting you...
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main page component
export default function VerifySignUpLink() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    }>
      <VerifySignUpForm />
    </Suspense>
  );
} 