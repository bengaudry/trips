import { FIREBASE_CONFIG } from "@/firebase";
import { prettifyFirebaseErrors } from "@/lib/firebase";
import {
  sendEmailVerification,
  User,
} from "firebase/auth";
import { useState } from "react";

export function useVerifyEmail(): [
  (email: User | null, callback?: () => void) => Promise<void>,
  boolean,
  string | null
] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (user: User | null, callback?: () => void) => {
    setError(null);
    if (!user) return setError("Please register first");

    setLoading(true);
    try {
      await sendEmailVerification(user);
      if (callback) callback();
    } catch (err: any) {
      setError(prettifyFirebaseErrors(err.code));
    } finally {
      setLoading(false);
    }
  };

  return [sendEmail, loading, error];
}
