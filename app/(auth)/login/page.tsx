import { cookies } from "next/headers";
import { Suspense } from "react";

import AuthPage from "@/components/design/templates/AuthPage";
import AuthFormSkeleton from "@/components/auth/molecules/AuthFormSkeleton";
import LoginForm from "@/components/auth/organisms/LoginForm";
import { SAVED_EMAIL_COOKIE } from "@/lib/savedEmail";

async function LoginFormWithSavedEmail() {
  const cookieStore = await cookies();
  const savedEmail = cookieStore.get(SAVED_EMAIL_COOKIE)?.value ?? "";
  return <LoginForm initialEmail={savedEmail} />;
}

export default function LoginPage() {
  return (
    <AuthPage>
      <Suspense fallback={<AuthFormSkeleton />}>
        <LoginFormWithSavedEmail />
      </Suspense>
    </AuthPage>
  );
}
