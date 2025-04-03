import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../../firebase.js"; // ✅ Import Firestore
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // ✅ Firestore functions
import Octicons from "@expo/vector-icons/Octicons";
import { Ionicons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import SwiperView from "./SwiperView.js";

const index = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid)); // ✅ Fetch user details from Firestore
          if (userDoc.exists()) {
            setUserName(userDoc.data().name); // ✅ Set the user's name
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await signOut(auth);
            router.replace("/authenticate/login");
          } catch (error) {
            console.error("Logout error:", error.message);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView>
      {/* Header */}
      <View style={{ padding: 12, height: 200, backgroundColor: "#dbddff" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Image
            style={{ width: 240, height: 60, resizeMode: "cover" }}
            source={require("../../../assets/logo_final.png")}
          />
          <Pressable onPress={handleLogout}>
            <Octicons name="sign-out" size={24} color="black" />
          </Pressable>
        </View>

        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontSize: 15, fontFamily: "Kailasa-Bold" }}>
              Hi {userName || "User"} !!
            </Text>
          </View>

          <Pressable
            onPress={() => setHelpModalVisible(true)}
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="black"
              />
              <Text
                style={{
                  width: 60,
                  fontSize: 12,
                  color: "#0066b2",
                  fontFamily: "KohinoorTelugu-Medium",
                }}
              >
                QUICK HELP
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Quick Help Modal */}
      <Modal
        visible={helpModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Quick Help</Text>
            <Text style={styles.modalText}>
              <Ionicons name="mail-outline" size={20} color="black" /> Email:
              support@laundryapp.com
            </Text>
            <Text style={styles.modalText}>
              <Ionicons name="call-outline" size={20} color="black" /> Contact:
              +91 98765 43210
            </Text>

            <Pressable
              onPress={() => setHelpModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* QUICK ORDER (Same layout for Mobile & Web) */}
      <View style={[styles.quickOrderContainer, { marginTop: -40 }]}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <View>
            <Text style={styles.quickOrderTitle}>QUICK ORDER</Text>
            <Text style={{ marginTop: 4 }}>
              Book a pickup and a delivery option
            </Text>
            <Text>We will be at your doorstep on time</Text>

            <View style={styles.quickOrderBottom}>
              <Pressable
                onPress={() => router.push("/tabs/home/address")}
                style={styles.bookNowButton}
              >
                <Text style={{ fontSize: 13, fontWeight: "00" }}>BOOK NOW</Text>
              </Pressable>
              <View style={{ width: 120 }}>
                <MaterialCommunityIcons name="truck" size={24} color="black" />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Swiper View */}
      <View style={styles.container}>
        <SwiperView />
      </View>

      {/* Order Section */}
      <Pressable onPress={() => router.push("/tabs/home/address")}>
        <View style={styles.orderSection}>
          <View style={styles.orderCard}>
            <Text style={styles.orderTitle}>
              Place Your{" "}
              <Text style={{ color: "black", fontSize: 20, fontWeight: "500" }}>
                Order{"  "}
              </Text>
              <View style={{ marginBottom: 10 }}>
                <Ionicons name="basket" size={22} color="black" />
              </View>
            </Text>
            <Text style={styles.orderDescription}>
              Choose from the catalogue below and book your order. It's about
              time.
            </Text>
          </View>
        </View>
      </Pressable>

      {/* Additional Features Section */}
      <View style={styles.featuresSection}>
        {/* Affordable Prices */}
        <Pressable onPress={() => router.push("/tabs/basket/select")}>
          <View style={styles.priceCard}>
            <View>
              <Text style={styles.priceTitle}>AFFORDABLE PRICES</Text>
              <Text style={{ marginTop: 4 }}>Get our Price List</Text>
            </View>
            <Entypo name="triangle-right" size={18} color="#034694" />
          </View>
        </Pressable>

        {/* Next Available Slot */}
        <View style={styles.slotCard}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Ionicons name="notifications-outline" size={24} color="black" />
            <Text>Next Available</Text>
          </View>
          <Text style={styles.slotText}>
            Order Within 15 mins to catch this pickUp Slot
          </Text>
          <Pressable
            onPress={() => router.push("/tabs/basket/select")}
            style={styles.addItemButton}
          >
            <Text>ADD ITEMS</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default index;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
    marginTop: 20, // Adjusted to avoid overlapping
  },
  quickOrderContainer: {
    padding: 15,
    backgroundColor: "white",
    width: 340,
    alignSelf: "center",
    borderRadius: 10,
    zIndex: 10,
  },
  quickOrderTitle: {
    fontSize: 15,
    color: "#0066b2",
    fontFamily: "Kailasa-Bold",
  },
  quickOrderBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 7,
  },
  bookNowButton: {
    backgroundColor: "#d9f6b1",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
  },
  orderSection: {
    marginTop: 20,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  orderCard: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
    width: 340,
  },
  orderTitle: {
    color: "#244774",
    fontSize: 18,
    fontWeight: "500",
  },
  orderDescription: {
    fontSize: 14,
    fontWeight: "400",
    width: 320,
    marginTop: 10,
  },
  featuresSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 10,
    padding: 10,
  },
  priceCard: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
    height: 121,
  },
  priceTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#034694",
  },
  slotCard: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 7,
    flex: 1,
    marginLeft: 5,
  },
  slotText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 5,
    color: "#034694",
    width: 140,
  },
  addItemButton: {
    backgroundColor: "#d9f6b1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#dbddff",
    padding: 10,
    borderRadius: 5,
  },
  closeText: {
    color: "black",
    fontSize: 14,
  },
});
