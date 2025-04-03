import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const cart = () => {
  const router = useRouter();
  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.item.price * item.item.quantity)
    
    .reduce((prev, curr) => prev + curr, 0);
  return (
    <ScrollView>
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
            onPress={() => router.push("/tabs/basket/select")}
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
        <Text style={{ flex: 1, fontSize: 18, fontWeight: "500" }}>
          Cart Items
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "transparent",
          padding: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: "500", color: "black" }}>
          Basket Total
        </Text>

        <View>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "black" }}>
            ₹ {total}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "black" }}>
            for {cart.length} items
          </Text>
        </View>
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
              <Text style={{ fontSize: 14, fontWeight: "500" }}>
                {item?.item.name}
              </Text>
              <Text>
                {"₹ "}
                {item?.item.price}
                {" * "}
                {item?.item.quantity}
                {" items = ₹"}
                {item?.item.price * item?.item.quantity}
              </Text>
            </View>

            {/* <Pressable>
              <AntDesign name="pluscircleo" size={24} color="#89CFF0" />
            </Pressable> */}
          </Pressable>
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          padding: 15,
          alignItems: "center",
          gap: 12,
          marginTop: 30,
        }}
      >
        
        <Pressable
          onPress={() => router.push("/tabs/home/address")}
          style={{
            backgroundColor: "#C5E1A5",
            padding: 15,
            borderRadius: 5,
            flex: 1,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "black", fontWeight: "500" }}
          >
            Checkout
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default cart;

const styles = StyleSheet.create({});
