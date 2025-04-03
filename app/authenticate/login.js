import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import Fontisto from "@expo/vector-icons/Fontisto";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const router = useRouter();

  // Check if user is already logged in (Prevent Unmatched Route Glitch)
  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = await AsyncStorage.getItem("auth");
      if (storedAuth) {
        console.log("User already logged in, redirecting...");
        setUserLoggedIn(true); // Set user state before navigating
      }
      setIsAuthChecked(true);
    };

    checkAuth();
  }, []);

  // Redirect after confirming the auth check (Prevents re-render glitch)
  useEffect(() => {
    if (userLoggedIn) {
      console.log("Navigating to Home Page...");
      router.replace("/tabs/home");
    }
  }, [userLoggedIn]);

  const handleLogin = async () => {
    if (loading) return;
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("User Logged In:", user);

      if (!user.emailVerified) {
        Alert.alert("Verify Email", "Please verify your email first.");
        setLoading(false);
        return;
      }

      // Update Firestore User Data
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { verified: true });

      // Store UID in AsyncStorage and wait for completion
      await AsyncStorage.setItem("auth", JSON.stringify(user.uid));

      console.log("User stored in AsyncStorage, navigating...");
      setUserLoggedIn(true); // Set user state before navigation
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Login Failed:", "Invalid username/password");
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen while checking authentication
  if (!isAuthChecked) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007FFF" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/login1.png")} style={styles.logo} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007FFF" />
          <Text style={styles.loadingText}>Logging in...</Text>
        </View>
      ) : (
        <KeyboardAvoidingView behavior="padding" style={styles.formContainer}>
          <Text style={styles.loginTitle}>Log in to your Account</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="black" style={styles.icon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="grey"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Fontisto name="locked" size={24} color="black" style={styles.icon} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="grey"
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <Pressable onPress={handleLogin} style={styles.loginButton} disabled={loading}>
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>

          {/* Signup Link */}
          <Pressable onPress={() => router.push("/authenticate/register")} style={styles.signUpLink}>
            <Text style={styles.signUpText}>
              Don't have an account? <Text style={styles.signUpHighlight}>Sign up</Text>
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  logoContainer: {
    height: 130,
    backgroundColor: "#dbddff",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: "cover",
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    alignContent: "center",
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#d9f6b1",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: 200,
    alignSelf: "center",
  },
  loginButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  signUpLink: {
    marginTop: 20,
    alignItems: "center",
  },
  signUpText: {
    color: "#666",
  },
  signUpHighlight: {
    color: "#007FFF",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#007FFF",
  },
});

export default Login;
