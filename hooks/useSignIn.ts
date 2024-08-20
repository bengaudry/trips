import { getFirebaseAuth } from "@/firebase";
import { isEmailFormatCorrect } from "@/lib";
import { prettifyFirebaseErrors } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export function useSignIn(): [
  (email: string, password: string, callback?: () => void) => Promise<void>,
  boolean,
  string | null
] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (
    email: string,
    password: string,
    callback?: () => void
  ) => {
    setError(null);
    if (!isEmailFormatCorrect(email)) return setError("Email format incorrect");
    
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password
      );
      console.info("Signed in user", userCredential.user.email, "successfully");
      if (callback) callback();
    } catch (err: any) {
      setError(prettifyFirebaseErrors(err.code));
    } finally {
      setLoading(false);
    }
  };

  return [signIn, loading, error];
}
