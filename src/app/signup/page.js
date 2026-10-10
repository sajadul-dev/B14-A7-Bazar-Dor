import AuthShell from "../components/AuthShell";
import SignUpForm from "../components/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthShell activePage="signup">
      <SignUpForm />
    </AuthShell>
  );
}