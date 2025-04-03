import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";

const index = () => {
  const router = useRouter();
  const cart = useSelector((state) => state.cart.cart);
  console.log(cart);
  return (
    <View>
      <View
        style={{
          padding: 20,
          backgroundColor: "#dbddff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500", color: "black" }}>
          Basket Total
        </Text>
        <View>
          <Text style={{ color: "black", fontSize: 15 }}>Rs 0</Text>
          <Text style={{ color: "black", fontSize: 15 }}>FOR 0 ITEMS</Text>
        </View>
      </View>

      <View
        style={{
          padding: 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 7,
          marginTop: 20,
          marginHorizontal: 10,
          height: 200,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "600" }}>
          YOUR BASKET IS EMPTY
        </Text>
      </View>

      <Pressable
        onPress={() => router.push("/tabs/basket/select")}
        style={{
          marginTop: 50,
          alignItems: "center",
          justifyContent: "center",
          padding: 15,
          width: 200,
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: 4,
          backgroundColor: "#C5E1A5",
        }}
      >
        <Text style={{ textAlign: "center", color: "black" }}>
          Place an Order
        </Text>
      </Pressable>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
