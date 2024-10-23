import { useEffect, useState } from "react";
import { onAuthStateChanged, onIdTokenChanged, updateCurrentUser, updateProfile, type User } from "firebase/auth";

import { getFirebaseAuth } from "@/firebase";

export const useAuth = () => {
  const [user, setUser] = useState<(User & { isPremium: boolean }) | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleUser = (user: User | null) => {
    setUser({ ...user, isPremium: false });
    setLoading(false);
  };

  const signOut = () => {
    setLoading(true);
    getFirebaseAuth()
      .signOut()
      .then(() => handleUser(null))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  onAuthStateChanged(getFirebaseAuth(), setUser);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(getFirebaseAuth(), handleUser);
    return () => unsubscribe();
  }, []);

  return { user, loading, signOut };
};
