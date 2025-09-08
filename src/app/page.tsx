"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

// Dynamically import AdminDashboardPage as a Client Component wrapper
const AdminDashboardPage = dynamic(() => import("./admin/dashboard/page"), { ssr: false });
const SignInPage = dynamic(() => import("./sign-in/page"), { ssr: false });

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return <div>Loading...</div>; // optional loader
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
    <div className="p-4">
      <p className="mb-4 text-red-500">Unauthorized: only admins can view this page.</p>
      <Button onClick={() => router.push("/sign-in")}>
        Go to Sign In
      </Button>
    </div>
  );
}
