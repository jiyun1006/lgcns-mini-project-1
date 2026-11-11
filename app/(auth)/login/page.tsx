import { cookies } from "next/headers";
import { Suspense } from "react";

import AuthFormSkeleton from "@/components/molecules/AuthFormSkeleton";
import LoginForm from "@/components/organisms/LoginForm";
import { SAVED_EMAIL_COOKIE } from "@/lib/savedEmail";

async function LoginFormWithSavedEmail() {
  const cookieStore = await cookies();
  const savedEmail = cookieStore.get(SAVED_EMAIL_COOKIE)?.value ?? "";
  return <LoginForm initialEmail={savedEmail} />;
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#F7F7F8] px-5 py-12">
      <Suspense fallback={<AuthFormSkeleton />}>
        <LoginFormWithSavedEmail />
      </Suspense>
    </main>
  );
}
