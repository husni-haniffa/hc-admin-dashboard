import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex mx-auto min-h-screen justify-center items-center">
      <SignIn />
    </div>
  );
}