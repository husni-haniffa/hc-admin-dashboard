"use client";

import { UserButton, useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">Hanifa Catering</h1>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Welcome, {user.firstName}</span>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          ) : (
            <Button variant="outline" onClick={() => router.push("/sign-in")}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}