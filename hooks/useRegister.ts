import { getFirebaseAuth } from "@/firebase";
import { isEmailFormatCorrect } from "@/lib";
import { prettifyFirebaseErrors } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";

export function useRegister(): [
  (
    email: string,
    password: string,
    displayName: string,
    callback?: () => void
  ) => Promise<void>,
  boolean,
  string | null
] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    email: string,
    password: string,
    displayName: string,
    callback?: () => void
  ) => {
    setError(null);
    if (!isEmailFormatCorrect(email)) return setError("Email format incorrect");
    if (password.length < 8)
      return setError("Password should be at least 8 characters long");
    if (displayName.length < 3)
      return setError("Display name should be at least 3 characters long");

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName });
      if (callback) callback();
    } catch (err: any) {
      console.error(err.message)
      setError(
        err.code
          ? prettifyFirebaseErrors(err.code)
          : "Error while registering user" + JSON.stringify(err)
      );
    } finally {
      setLoading(false);
    }
  };

  return [register, loading, error];
}
