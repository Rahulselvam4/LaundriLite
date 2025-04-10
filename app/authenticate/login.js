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
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import Fontisto from "@expo/vector-icons/Fontisto";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const login = () => {
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

  // Function to register for push notifications
  const registerForPushNotificationsAsync = async (userId) => {
    let token;

    if (!Device.isDevice) {
      Alert.alert("Notice", "Push notifications require a physical device");
      return null;
    }

    try {
      // Check and request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log("Failed to get push notification permissions");
        return null;
      }

      // Get the token
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })).data;
      
      console.log("Push notification token:", token);

      // For Android, create a notification channel
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Save token to Firestore
      if (userId && token) {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, { 
          pushToken: token,
          deviceType: Platform.OS,
          tokenUpdatedAt: new Date()
        });
        console.log("Push token saved to user profile");
      }

      return token;
    } catch (error) {
      console.error("Error setting up notifications:", error);
      return null;
    }
  };

  // Send a welcome notification
  const sendWelcomeNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Welcome back!",
          body: "You've successfully logged in to your account.",
          data: { screen: "home" },
        },
        trigger: null, // null means show immediately
      });
      console.log("Welcome notification sent");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

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

      // Register for push notifications and save token
      await registerForPushNotificationsAsync(user.uid);
      
      // Send welcome notification
      await sendWelcomeNotification();

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

export default login;