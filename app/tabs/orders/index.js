import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import { collection, query, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

const index = () => {
  const router = useRouter();
  const userUid = auth?.currentUser?.uid;
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!userUid) {
      console.error("User UID not available");
      return;
    }

    const ordersCollectionRef = collection(db, "users", userUid, "orders");
    const ordersQuery = query(ordersCollectionRef);

    // ✅ Set up real-time listener for order updates
    const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
      const fetchedOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Orders Updated:", fetchedOrders);
      setOrders(fetchedOrders);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, [userUid]); // Runs when userUid changes

  // Open Order Summary Popup
  const openOrderSummary = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  // Generate PDF for Order Summary
  const generatePDF = async () => {
    if (!selectedOrder) return;

    const { address, pickupDate, pickuptime, deliveryDate, deliveryTime, totalPayable } = selectedOrder;

    console.log("Address Data:", address);

    const name = address?.name ?? "N/A";
    const mobile = address?.mobile ?? "N/A";

    const addressParts = [
      address?.houseNo, 
      address?.landmark, 
      address?.city, 
      address?.postalCode
    ].filter(Boolean);

    const formattedAddress = addressParts.length > 0 ? addressParts.join(", ") : "N/A";

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="text-align: center;">Order Summary</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          <p><strong>Address:</strong> ${formattedAddress}</p>
          <p><strong>Pickup Date:</strong> ${pickupDate}</p>
          <p><strong>Pickup Time:</strong> ${pickuptime}</p>
          <p><strong>Delivery Date:</strong> ${deliveryDate}</p>
          <p><strong>Delivery Time:</strong> ${deliveryTime}</p>
          <p><strong>Order Total:</strong> ₹${totalPayable || "0.00"}</p>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await shareAsync(uri);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header Section */}
      <View style={{ backgroundColor: "#dbddff" }}>
        <View style={{ height: 140, padding: 12 }}>
          <Image
            style={{ width: 240, height: 60, resizeMode: "cover" }}
            source={require("../../../assets/logo_final.png")}
          />
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
            <Ionicons
              onPress={() => router.push("/tabs/home")}
              name="arrow-back"
              size={24}
              color="black"
            />
            <Text style={{ fontSize: 17, fontWeight: "500", marginLeft: 10 }}>My Orders</Text>
          </View>
        </View>
      </View>

      {/* Orders List */}
      <ScrollView contentContainerStyle={{ padding: 12 }}>
        {orders.map((order, index) => (
          <Pressable key={index} style={styles.orderContainer}>
            {/* Light Green Header */}
            <View style={styles.orderHeader}>
              <Text style={styles.label}>Payment</Text>
              <Text style={styles.value}>Cash on Delivery</Text>
            </View>

            <View style={styles.orderBody}>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>Pickup Date</Text>
                  <Text style={styles.value}>{order.pickupDate}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>Delivery Date</Text>
                  <Text style={styles.value}>{order.deliveryDate}</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>Pickup Time</Text>
                  <Text style={styles.value}>{order.pickuptime}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionTitle}>Delivery Time</Text>
                  <Text style={styles.value}>{order.deliveryTime}</Text>
                </View>
              </View>

              {/* Display Total Payable */}
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text style={styles.sectionTitle}>Total Payable:</Text>
                <Text style={styles.value}> ₹ {order.totalPayable.toFixed(2)}</Text>
              </View>
            </View>

            {/* Order Summary Button */}
            <View style={styles.orderActions}>
              <Pressable onPress={() => openOrderSummary(order)} style={styles.summaryButton}>
                <MaterialCommunityIcons name="note-outline" size={24} color="black" />
                <Text style={styles.actionText}>Order Summary</Text>
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Order Summary Modal */}
      {selectedOrder && (
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="black" />
              </Pressable>
              <Text style={styles.modalTitle}>Order Summary</Text>
              <Text style={styles.modalText}><Text style={styles.bold}>Pickup Date:</Text> {selectedOrder.pickupDate}</Text>
              <Text style={styles.modalText}><Text style={styles.bold}>Pickup Time:</Text> {selectedOrder.pickuptime}</Text>
              <Text style={styles.modalText}><Text style={styles.bold}>Delivery Date:</Text> {selectedOrder.deliveryDate}</Text>
              <Text style={styles.modalText}><Text style={styles.bold}>Delivery Time:</Text> {selectedOrder.deliveryTime}</Text>
              <Text style={styles.modalText}><Text style={styles.bold}>Total Payable:</Text> ₹ {selectedOrder.totalPayable.toFixed(2)}</Text>

              <Pressable style={styles.downloadButton} onPress={generatePDF}>
                <Text style={styles.downloadText}>Share</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default index;



const styles = StyleSheet.create({
  orderContainer: {
    backgroundColor: "white",
    borderRadius: 7,
    marginVertical: 12,
  },
  orderHeader: {
    backgroundColor: "#e2f7c3",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderBody: { padding: 10 },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: { backgroundColor: "white", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "85%",
    elevation: 5, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    marginVertical: 6,
    color: "#444",
  },
  bold: {
    fontWeight: "bold",
    color: "#222",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 6,
  },
  downloadButton: {
    backgroundColor: "#5C67F2",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  downloadText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  orderActions: {
    alignItems: "flex-end",
    marginTop: 10,
    paddingBottom:10,
  },
  summaryButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    fontSize: 14,
    marginLeft: 5,
    color: "#5C67F2",
    fontWeight: "bold",
  },
});

