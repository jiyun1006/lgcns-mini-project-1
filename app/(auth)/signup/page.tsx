import SignupForm from "@/components/auth/organisms/SignupForm";
import AuthPage from "@/components/design/templates/AuthPage";

export default function SignupPage() {
  return (
    <AuthPage variant="signup">
      <SignupForm />
    </AuthPage>
  );
}
