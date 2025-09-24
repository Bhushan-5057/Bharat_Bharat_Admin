import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sign In - BHARAT BHARATI TRUST Admin Dashboard",
  description: "Sign in to your account to access the BHARAT BHARATI TRUST Admin Dashboard.",
};

export default  async function SignIn() {
 
  return <SignInForm />;
  
}
