import { SignUpButton } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <>
      <SignUpButton forceRedirectUrl="/dashboard" />
    </>
  );
}
