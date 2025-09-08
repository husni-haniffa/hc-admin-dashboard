"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingPage } from "@/components/ui/loading-spinner";
import dynamic from "next/dynamic";

// Dynamically import AdminDashboardPage as a Client Component wrapper
const AdminDashboardPage = dynamic(() => import("./(dashboard)/admin/dashboard/page"), { ssr: false });
const SignInPage = dynamic(() => import("./(auth)/sign-in/page"), { ssr: false });

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded) {
    return <LoadingPage message="Initializing application..." />;
  }

  if (!isSignedIn) {
    return <SignInPage />;
  }

  // check role from Clerk metadata
  const role = user?.publicMetadata?.role;

  if (role === "admin") {
    return <AdminDashboardPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
            <p className="text-gray-600">You don&apos;t have permission to access this area</p>
          </div>

          {/* Error Details */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-700 font-medium">Administrator Access Required</span>
            </div>
            <p className="text-red-600 text-sm">This dashboard is restricted to administrators only.</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => {
                signOut();
                router.push("/sign-in");
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In with Different Account
            </Button>

            <p className="text-sm text-gray-500">
              Need administrator access? Contact your system administrator.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2025 Hanifa Catering. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
