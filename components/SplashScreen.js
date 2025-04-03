import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../firebase"; // Import Firebase auth
import AsyncStorage from "@react-native-async-storage/async-storage";
import Sun_logo from "../assets/sun_logo.png";
import Logo from "../assets/logo.svg";

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            // User is logged in
            await AsyncStorage.setItem("auth", user.uid); // Store UID instead of a token
            router.replace("/tabs/home");
          } else {
            // No user found, go to login page
            await AsyncStorage.removeItem("auth"); // Clear old token if any
            router.replace("/authenticate/login");
          }
        });
      } catch (error) {
        console.log("Error checking auth status:", error);
        router.replace("/authenticate/login");
      }
    };

    setTimeout(() => {
      checkAuthStatus();
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={Sun_logo} style={styles.sunLogo} />
        <Logo width={100} height={100} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dbddff",
  },
  logoContainer: {
    position: "relative",
    width: 140,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  sunLogo: {
    position: "absolute",
    top: -55,
    left: -45,
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});

export default SplashScreen;
