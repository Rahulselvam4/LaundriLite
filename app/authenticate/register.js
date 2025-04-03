import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";

const Register = () => {
  const [name, setName] = useState(""); // ✅ Add name state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("All fields are required.");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      // ✅ Save name in Firestore along with email
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        verified: false,
      });

      Alert.alert(
        "Verify Your Email",
        "A verification email has been sent. Please verify before logging in."
      );

      router.replace("/authenticate/login");
    } catch (error) {
      console.error("Registration error:", error.message);
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View style={{ height: 130, backgroundColor: "#dbddff", width: "100%" }}>
        <View
          style={{
            marginTop: 25,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 250,
              height: 100,
              resizeMode: "cover",
              padding: 30,
            }}
            source={require("../../assets/login1.png")}
          />
        </View>
      </View>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={50}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                marginTop: 30,
                color: "black",
              }}
            >
              Register your Account
            </Text>
          </View>

          <View>
            
          <View 
            style={styles.inputField}
            >
              <MaterialIcons
                style={{ marginLeft: 8 }}
                name="person"
                size={24}
                color="black"
              />
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                style={{
                  color: "black",
                  width: 300,
                  marginVertical: 10,
                  fontSize: email ? 17 : 17,
                }}
                placeholder="Enter your name"
                placeholderTextColor={"grey"}
              />
            </View>

            <View 
            style={styles.inputField}
            >
              <MaterialIcons
                style={{ marginLeft: 8 }}
                name="email"
                size={22}
                color="black"
              />
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={{
                  color: "black",
                  width: 300,
                  marginVertical: 10,
                  fontSize: email ? 17 : 17,
                }}
                placeholder="Enter your email"
                placeholderTextColor={"grey"}
              />
            </View>

            <View 
            style={styles.inputField}
            >
              <Fontisto
                name="locked"
                size={24}
                color="black"
                style={{ marginLeft: 8 }}
              />
              <TextInput
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={{
                  color: "black",
                  width: 300,
                  marginVertical: 10,
                  fontSize: password ? 17 : 17,
                }}
                placeholder="Enter your password"
                placeholderTextColor={"grey"}
              />
            </View>

            <View 
            style={styles.inputField}
            >
              <Fontisto
                name="locked"
                size={22}
                color="black"
                style={{ marginLeft: 8 }}
              />
              <TextInput
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                style={{
                  color: "black",
                  width: 300,
                  marginVertical: 10,
                  fontSize: confirmPassword ? 17 : 17,
                }}
                placeholder="Confirm your password"
                placeholderTextColor={"grey"}
              />
            </View>
          </View>

          <Pressable onPress={handleRegister} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/authenticate/login")}
            style={{ marginTop: 12 }}
          >
            <Text style={{ textAlign: "center", fontSize: 15 }}>
              Already have an account?{" "}
              <Text style={{ color: "#007FFF" }}>Log in</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  button: {
    width: 200,
    backgroundColor: "#d9f6b1",
    borderRadius: 6,
    padding: 15,
    marginTop: 35,
    alignSelf: "center",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },

  inputField: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "#f0f0f0",
      paddingVertical: 1,
      borderRadius: 5,
      marginTop: 20,
  },

});
