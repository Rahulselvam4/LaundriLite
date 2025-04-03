
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useRouter } from "expo-router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If the user exists, check if they are verified
        if (user.emailVerified) {
          setUser(user);
          router.replace("/home"); // ✅ Go to home only if verified
        } else {
          signOut(auth); // 🚨 Log out unverified users
          router.replace("/authenticate/login"); // Send back to login
        }
      } else {
        setUser(null);
        router.replace("/authenticate/login"); // Send to login if no user
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);
export default AuthProvider;