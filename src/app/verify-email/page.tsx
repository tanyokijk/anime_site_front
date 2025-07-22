import VerifyEmailMessage from "@/components/auth/verify-email";

export default function EmailVerificationPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-2 md:p-6 flex-col gap-8">
      <VerifyEmailMessage />
    </div>
  );
}
