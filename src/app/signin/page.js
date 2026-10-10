import AuthShell from "../components/AuthShell";
import SignInForm from "../components/SignInForm";

export default function SignInPage() {
  return (
    <AuthShell activePage="signin">
      <SignInForm />
    </AuthShell>
  );
}