import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { cleanCart } from "../../../redux/CartReducer";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Address = () => {
  const userUid = auth?.currentUser.uid;
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.item.price * item.item.quantity)
    .reduce((prev, curr) => prev + curr, 0);
  const [step, setStep] = useState(1);
  const [selectedScent, setSelectedScent] = useState("20");
  const [currentDate, setCurrentDate] = useState(moment());
  const [deliveryDate, setDeliveryDate] = useState(moment());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0] || null);

  const handleBack = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  const pickupTimeOptions = [
    { startTime: "6:30 AM", endTime: "9:00 AM" },
    { startTime: "9:00 AM", endTime: "11:30 AM" },
    { startTime: "5:00 PM", endTime: "7:30 PM" },
    { startTime: "7:30 PM", endTime: "10:00 PM" },
  ];

  console.log("addresses", addresses);
  console.log("userId", userUid);

  const handleNext = () => {
    // Step 2: Pickup time must be selected
    if (step === 2 && !selectedTime) {
      Alert.alert(
        "Missing Pickup Time",
        "Please select a pickup time before proceeding."
      );
      return;
    }

    // Step 3: Delivery slot must be selected
    if (step === 3 && !selectedDeliveryTime) {
      Alert.alert(
        "Missing Delivery Time",
        "Please select a delivery time slot before proceeding."
      );
      return;
    }

    setStep((prevStep) => {
      const nextStep = prevStep + 1;
      console.log("next step", nextStep);

      // If it's the last step (e.g., 5), place the order
      if (nextStep === 5) {
        placeOrder();
      }

      return nextStep;
    });
  };
 
  const sendOrderConfirmationSMS = async (phoneNumber, orderId ,total) => {
    try {
      const response = await fetch("http://10.16.52.208:5000/send-order-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, orderId, total }),
      });
  
      const result = await response.json();
      if (result.success) {
        console.log("SMS sent with SID:", result.sid);
      } else {
        console.error("SMS sending failed:", result.error);
      }
    } catch (error) {
      console.error("Failed to send SMS:", error.message);
    }
  };
  
  const placeOrder = async () => {
    // Debugging checkpoint 1
    console.log("1. Starting placeOrder");

    try {
      // Debugging checkpoint 2
      console.log("2. Attempting to save to DB");

      const orderRef = await saveOrderToDB();

      // Debugging checkpoint 3
      console.log("3. DB save successful, showing alert");

      // Send order confirmation notification
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Order Placed Successfully!",
            body: `Your order #${orderRef.id.slice(-6)} has been placed. Total: $${parseFloat(
              (
                total +
                parseFloat(selectedScent || 0) -
                discount +
                25 + // Delivery
                150
              ).toFixed(2) // Taxes
            )}`,
            data: { screen: "orders", orderId: orderRef.id },
          },
          trigger: null, // null means send immediately
        });
        console.log("3.1 Order notification sent");
      } catch (error) {
        console.error("Failed to send notification:", error);
        // Continue with order process even if notification fails
      }
      // Send SMS if there's a phone number
      if (selectedAddress && selectedAddress.mobile) {
        try {
          await sendOrderConfirmationSMS(
            selectedAddress.mobile,
            orderRef.id,
            (
              total +
              parseFloat(selectedScent || 0) -
              discount +
              25 + // Delivery
              150   // Taxes
            ).toFixed(2)
          );
          console.log("3.2 Order confirmation SMS sent");
        } catch (smsError) {
          console.error("Failed to send SMS:", smsError);
          // Continue with order process even if SMS fails
        }
      }
      // Force UI thread to settle before showing alert
      await new Promise((resolve) => setTimeout(resolve, 100));

      Alert.alert(
        "Order Placed",
        "Your order was successful!",
        [
          {
            text: "OK",
            onPress: () => {
              // Debugging checkpoint 4
              console.log("4. Alert OK pressed - cleaning cart");
              dispatch(cleanCart());

              // Debugging checkpoint 5
              console.log("5. Navigating to orders");
              router.replace("/tabs/orders");
            },
          },
        ],
        {
          cancelable: false,
          onDismiss: () => {
            // Debugging checkpoint 6
            console.log("6. Alert was dismissed unexpectedly");
          },
        }
      );

      // Debugging checkpoint 7
      console.log("7. Alert shown (this should appear before navigation)");
    } catch (error) {
      // Debugging checkpoint 8
      console.error("8. Order error:", error);
      Alert.alert("Error", "Order failed. Please try again.");
    }
  };

  // Add these debugging logs to your save function too
  const saveOrderToDB = async () => {
    console.log("DB_1. Starting save");
    const totalPayable = (
      total +
      parseFloat(selectedScent || 0) -
      discount +
      25 + // Delivery
      150
    ) // Taxes
      .toFixed(2);

    console.log("DB_2. Creating document");
    const orderRef = await addDoc(collection(db, "users", userUid, "orders"), {
      items: [...cart],
      address: selectedAddress,
      pickuptime: selectedTime
        ? `${selectedTime.startTime} - ${selectedTime.endTime}`
        : "Not specified",
      deliveryTime: selectedDeliveryTime
        ? `${selectedDeliveryTime.startTime} - ${selectedDeliveryTime.endTime}`
        : "Not specified",
      pickupDate: selectedDate.format("YYYY-MM-DD"),
      deliveryDate: deliveryDate.format("YYYY-MM-DD"),
      totalPayable: parseFloat(totalPayable),
      createdAt: new Date(),
    });

    console.log("DB_3. Document created with ID:", orderRef.id);
    return orderRef;
  };
  const getNext6Days = () => {
    const nextDays = [];
    for (let i = 0; i < 4; i++) {
      const nextDate = moment(currentDate).add(i, "days");

      nextDays.push(nextDate);
    }

    return nextDays;
  };
  const getNextDays = () => {
    const nextDays = [];
    let startDate = moment().add(1, "days");

    if (moment(selectedDate).isSameOrBefore(moment().add(2, "days"), "day")) {
      startDate = moment(selectedDate).add(2, "days");
    }

    for (let i = 0; i < 4; i++) {
      const nextDate = moment(startDate).add(i, "days");
      nextDays.push(nextDate);
    }

    return nextDays;
  };
  const renderDateButtons = () => {
    const next6Days = getNext6Days();

    return next6Days?.map((date, index) => (
      <TouchableOpacity
        onPress={() => setSelectedDate(date)}
        style={{
          padding: 10,
          margin: 10,
          borderRadius: 6,
          width: 50,
          backgroundColor: date.isSame(selectedDate, "day")
            ? "#0066b2"
            : "white",
          borderColor: date.isSame(selectedDate, "day")
            ? "transparent"
            : "#0066b2",
          borderWidth: date.isSame(selectedDate, "day") ? 0 : 1,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 13,
            color: date.isSame(selectedDate, "day") ? "white" : "black",
          }}
        >
          {date?.format("D")}
        </Text>
        <Text
          style={{
            marginTop: 3,
            textAlign: "center",
            fontSize: 13,
            color: date.isSame(selectedDate, "day") ? "white" : "black",
          }}
        >
          {date?.format("ddd")}
        </Text>
      </TouchableOpacity>
    ));
  };

  const renderButtons = () => {
    const next6Days = getNextDays();

    return next6Days.map((date, index) => (
      <TouchableOpacity
        style={{
          padding: 10,
          margin: 10,
          borderRadius: 6,
          width: 50,
          backgroundColor: date.isSame(deliveryDate, "day")
            ? "#0066b2"
            : "white",
          borderColor: date.isSame(deliveryDate, "day")
            ? "transparent"
            : "#0066b2",
          borderWidth: date.isSame(deliveryDate, "day") ? 0 : 1,
        }}
        onPress={() => setDeliveryDate(date)}
        key={index}
      >
        <Text
          style={{
            textAlign: "center",
            marginTop: 3,
            fontSize: 13,
            color: date.isSame(deliveryDate, "day") ? "white" : "black",
          }}
        >
          {date?.format("D")}
        </Text>
        <Text
          style={{
            textAlign: "center",
            marginTop: 3,
            fontSize: 13,
            color: date.isSame(deliveryDate, "day") ? "white" : "black",
          }}
        >
          {date?.format("ddd")}
        </Text>
      </TouchableOpacity>
    ));
  };
  const renderPickUpTimeOptions = () => {
    if (selectedDate) {
      const isCurrentDate = selectedDate.isSame(currentDate, "day");

      const currentTime = moment();

      return pickupTimeOptions.map((option, index) => {
        console.log(option);
        const startTime = moment(
          selectedDate.format("YYYY-MM-DD") + " " + option.startTime,
          "YYYY-MM-DD LT"
        );

        //check if the time slot is past the current time
        const isTimeSlotPast = isCurrentDate && startTime.isBefore(currentDate);

        return (
          <TouchableOpacity
            onPress={() => {
              if (!isTimeSlotPast) {
                setSelectedTime(option);
              }
            }}
            style={{
              textDecorationLine: isTimeSlotPast ? "line-through" : "none",
              opacity: isTimeSlotPast ? 0.5 : 1,
              padding: 10,
              margin: 10,
              borderRadius: 5,
              backgroundColor:
                selectedTime &&
                  selectedTime.startTime === option.startTime &&
                  selectedTime.endTime === option.endTime
                  ? "#0066b2"
                  : "white",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color:
                  selectedTime &&
                    selectedTime.startTime === option.startTime &&
                    selectedTime.endTime === option.endTime
                    ? "white"
                    : "black",
              }}
            >{`${option.startTime} - ${option.endTime}`}</Text>
          </TouchableOpacity>
        );
      });
    }
  };
  const renderTimeOptions = () => {
    return pickupTimeOptions.map((option, index) => {
      console.log(option);
      const startTime = moment(
        selectedDate.format("YYYY-MM-DD") + " " + option.startTime,
        "YYYY-MM-DD LT"
      );

      // Check if the time slot is past the current time
      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setSelectedDeliveryTime(option);
          }}
          style={{
            margin: 10,
            padding: 10,
            borderRadius: 5,
            backgroundColor:
              selectedDeliveryTime &&
                selectedDeliveryTime.startTime === option.startTime &&
                selectedDeliveryTime.endTime === option.endTime
                ? "#0066b2"
                : "white",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color:
                selectedDeliveryTime &&
                  selectedDeliveryTime.startTime === option.startTime &&
                  selectedDeliveryTime.endTime === option.endTime
                  ? "white"
                  : "black",
            }}
          >{`${option.startTime} - ${option.endTime}`}</Text>
        </TouchableOpacity>
      );
    });
  };
  const applyPromoCode = () => {
    let discountValue = 0;
    if (promoCode === "NEW40") {
      discountValue = total * 0.4;
    } else if (promoCode === "MON30") {
      discountValue = total * 0.3;
    } else if (promoCode === "SPCL20") {
      discountValue = total * 0.2;
    } else {
      discountValue = 0; // Invalid or no promo code
    }
    setDiscount(discountValue);
  };

  const handleScentChange = (value) => {
    setSelectedScent(value);
  };

  const fetchAddress = async () => {
    try {
      if (!userUid) return; // Prevent errors if user is not logged in

      const addressCollectionRef = collection(
        db,
        "users",
        userUid,
        "userAddresses"
      );
      const querySnapshot = await getDocs(addressCollectionRef);

      const addresses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAddresses(addresses);
    } catch (error) {
      console.log("Error fetching addresses:", error);
    }
  };

  // Fetch addresses when component mounts
  useEffect(() => {
    fetchAddress();
  }, []);

  // Set first address as default when list updates
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses]);

  // Delete Address
  const handleDeleteAddress = async (addressId) => {
    try {
      if (!userUid) {
        console.error("User UID is undefined.");
        return;
      }
      if (!addressId || typeof addressId !== "string") {
        console.error("Invalid Address ID:", addressId);
        return;
      }

      console.log("Deleting address with ID:", addressId);

      const addressDocRef = doc(
        db,
        "users",
        userUid,
        "userAddresses",
        addressId
      );
      await deleteDoc(addressDocRef); // Delete from Firestore

      // Refresh addresses after deletion
      fetchAddress();
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Failed to delete address. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "#dbddff",
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => router.push("/tabs/home")}
            style={{
              width: 30,
              height: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </Pressable>
        </View>
        <Text style={{ flex: 1, fontSize: 17, fontWeight: "500" }}>
          Choose your address
        </Text>
      </View>

      <View style={{ backgroundColor: "transparent", flex: 1, padding: 10 }}>
        <ScrollView>
          {step == 1 && (
            <View>
              {/* Add Address Section */}
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingTop: 10,
                }}
              >
                <AntDesign name="plus" size={24} color="black" />
                <Pressable onPress={() => router.push("tabs/home/add")}>
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    Add address
                  </Text>
                </Pressable>
              </Pressable>

              <View>
                {/* Map Over Addresses */}
                {addresses?.map((item, index) => (
                  <Pressable
                    onPress={() => setSelectedAddress(item)} // Set selected address
                    key={index}
                    style={{
                      backgroundColor: "white",
                      padding: 10,
                      marginVertical: 10,
                      borderRadius: 5,
                      borderWidth: selectedAddress === item ? 2 : 1,
                      borderColor:
                        selectedAddress === item ? "#0066b2" : "white",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Address Title & Flag */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <Ionicons
                          name="location-outline"
                          size={24}
                          color="black"
                        />
                        <Text style={{ fontSize: 17, fontWeight: "500" }}>
                          Home
                        </Text>

                        {/* Flag Icon - Only on Selected Address */}
                        {selectedAddress === item && (
                          <FontAwesome name="flag" size={20} color="#b1b4e6" />
                        )}
                      </View>

                      <Text>{item.addressLine}</Text>

                      {/* Delete Address Icon */}
                      <Pressable onPress={() => handleDeleteAddress(item.id)}>
                        <Ionicons
                          name="trash-outline"
                          size={24}
                          color="black"
                        />
                      </Pressable>
                    </View>

                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: 15,
                        fontWeight: "500",
                        width: "95%",
                      }}
                    >
                      {item?.houseNo}, {item?.landmark},
                    </Text>
                    <Text
                      style={{
                        marginTop: 6,
                        color: "gray",
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      {item?.city}, {item?.postalCode}.
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {step == 2 && (
            <View
              style={{
                marginTop: 10,
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  // justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Fontisto name="date" size={24} color="black" />
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    Pick up slot
                  </Text>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    marginTop: 4,
                    fontWeight: "500",
                    fontSize: 16,
                  }}
                >
                  {currentDate.format("MMMM YYYY")}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {renderDateButtons()}
              </View>

              <Text style={{ marginHorizontal: 10, fontWeight: "600" }}>
                Pickup Time Options
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {renderPickUpTimeOptions()}
              </View>
            </View>
          )}

          {step == 3 && (
            <>
              <View
                style={{
                  backgroundColor: "white",
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Fontisto name="date" size={24} color="black" />
                    <Text style={{ fontSize: 15, fontWeight: "600" }}>
                      Pick up slot
                    </Text>
                  </View>
                  <AntDesign
                    onPress={handleBack}
                    name="edit"
                    size={24}
                    color="black"
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* <Text>Date: </Text> */}
                  <View
                    style={{
                      padding: 10,
                      margin: 10,
                      borderRadius: 6,
                      width: 50,
                      backgroundColor: "#0066b2",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 13,
                        color: "white",
                      }}
                    >
                      {selectedDate.format("D")}
                    </Text>

                    <Text
                      style={{
                        textAlign: "center",
                        color: "white",
                        marginTop: 3,
                        fontSize: 13,
                      }}
                    >
                      {selectedDate.format("ddd")}
                    </Text>
                  </View>
                  <Text>Timing: </Text>
                  <View
                    style={{
                      padding: 10,
                      borderRadius: 5,
                      backgroundColor: "#0066b2",
                    }}
                  >
                    <Text
                      style={{ textAlign: "center", color: "white" }}
                    >{`${selectedTime.startTime} - ${selectedTime.endTime}`}</Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: "white",
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Fontisto name="date" size={24} color="black" />
                  <Text
                    style={{ fontSize: 15, fontWeight: "600", marginLeft: "8" }}
                  >
                    Delivery slot
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {renderButtons()}
                </View>

                <Text
                  style={{
                    marginHorizontal: 10,
                    marginTop: 10,
                    fontWeight: 600,
                  }}
                >
                  Delivery Time Options
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {renderTimeOptions()}
                </View>
              </View>
            </>
          )}

          {step == 4 && (
            <View
              style={{
                marginTop: 10,
                backgroundColor: "white",
                borderRadius: 10,
              }}
            >
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  Your Cart
                </Text>
              </View>

              <View style={{ marginHorizontal: 12 }}>
                {cart?.map((item, index) => (
                  <Pressable
                    style={{
                      padding: 10,
                      backgroundColor: "white",
                      marginVertical: 13,
                      flexDirection: "row",
                      gap: 12,
                      borderRadius: 5,
                    }}
                    key={index}
                  >
                    <View>
                      <Image
                        style={{ width: 40, height: 40 }}
                        source={{ uri: item?.item?.image }}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text>{item?.item.name}</Text>
                      <Text>
                        {"₹ "}
                        {item?.item.price}
                        {" * "}
                        {item?.item.quantity}
                        {" items = ₹"}
                        {item?.item.price * item?.item.quantity}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>

              {/* First Container */}
              <View
                style={{
                  backgroundColor: "#dbddff",
                  padding: 10,
                  borderRadius: 6,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    Choose Scent
                  </Text>

                  <Picker
                    selectedValue={selectedScent}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue) => handleScentChange(itemValue)}
                  >
                    <Picker.Item label="Neutral - ₹20" value="20" />
                    <Picker.Item label="Lavender - ₹50" value="50" />
                    <Picker.Item label="Rose - ₹40" value="40" />
                    <Picker.Item label="Jasmine - ₹45" value="45" />
                    <Picker.Item label="Sandalwood - ₹60" value="60" />
                    <Picker.Item label="Lemon - ₹35" value="35" />
                  </Picker>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    Total Amount
                  </Text>
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    ₹ {total + parseFloat(selectedScent)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  {/* Left Side: Promo Code Label */}
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    Promo Code
                  </Text>

                  {/* Right Side: Input Box & Apply Button */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: "transparent",
                        borderRadius: 5,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        width: 120,
                        textAlign: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        color: "black",
                      }}
                      placeholder="Enter Code"
                      placeholderTextColor="gray"
                      value={promoCode}
                      onChangeText={(text) => setPromoCode(text.toUpperCase())}
                    />

                    <Pressable
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                        paddingVertical: 8,
                        paddingHorizontal: 10,
                        width: 80,
                        borderRadius: 5,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={applyPromoCode}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
                        Apply
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    Discount
                  </Text>
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    ₹ {discount.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Second Container */}
              <View
                style={{
                  backgroundColor: "#dbddff",
                  padding: 10,
                  borderRadius: 6,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    Taxes and Charges
                  </Text>
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    ₹ 150
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    Delivery Charges
                  </Text>
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    ₹ 25
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                  }}
                >
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    Total Payable
                  </Text>
                  <Text style={{ color: "black", fontWeight: "500" }}>
                    ₹{" "}
                    {(
                      total +
                      parseFloat(selectedScent) -
                      discount +
                      25 +
                      150
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {cart.length > 0 && (
        <Pressable style={{ backgroundColor: "#E0E0E0", padding: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="basket-outline" size={24} color="black" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "500" }}>
                Basket Total Rs {total}
              </Text>
              <Text style={{ fontSize: 13, fontWeight: "500", marginTop: 3 }}>
                You have {cart.length} items saved in your basket
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/tabs/basket/cart")}
              style={{ padding: 10, backgroundColor: "white", borderRadius: 4 }}
            >
              <Text>View</Text>
            </Pressable>
          </View>
        </Pressable>
      )}

      <View
        style={{
          backgroundColor: "transparent",
          flexDirection: "row",
          padding: 15,
          alignItems: "center",
          gap: 12,
          marginTop: "auto",
        }}
      >
        <Pressable
          disabled={step === 1}
          onPress={handleBack}
          style={{
            backgroundColor: "#d0d0d0",
            padding: 15,
            borderRadius: 5,
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "500" }}>Back</Text>
        </Pressable>
        <Pressable
          onPress={handleNext}
          style={{
            backgroundColor: "#C5E1A5",
            padding: 15,
            borderRadius: 5,
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "500" }}>
            {step == 4 ? "Place Order" : "Next"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Address;

const styles = StyleSheet.create({});