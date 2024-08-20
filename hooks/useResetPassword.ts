import { getFirebaseAuth } from "@/firebase";
import { isEmailFormatCorrect } from "@/lib";
import { prettifyFirebaseErrors } from "@/lib/firebase";
import { sendPasswordResetEmail,  } from "firebase/auth";
import { useState } from "react";

export function useResetPassword(): [
  (email: string, callback?: () => void) => Promise<void>,
  boolean,
  string | null
] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (email: string, callback?: () => void) => {
    setError(null);
    if (!isEmailFormatCorrect(email)) return setError("Email format incorrect");

    setLoading(true);
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email, )
      console.info("Sent email to", email, "successfully");
      if (callback) callback();
    } catch (err: any) {
      setError(prettifyFirebaseErrors(err.code));
    } finally {
      setLoading(false);
    }
  };

  return [resetPassword, loading, error];
}
