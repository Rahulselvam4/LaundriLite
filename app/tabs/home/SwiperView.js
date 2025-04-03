import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import coupon1 from "../../../assets/Coupon1111.png";
import coupon2 from "../../../assets/Coupon211.jpg";
import coupon3 from "../../../assets/Coupon3w.jpg";

const SwiperView = () => {
  const navigation = useNavigation();

  const handleNavigation = (coupon) => {
    navigation.navigate("Address", { coupon }); // Pass coupon data to Address
  };

  return (
    <View style={styles.swiperContainer}>
      <Swiper
        autoplay
        autoplayTimeout={3}
        showsPagination={true}
        activeDotColor="#b1b4e6"
        loop
        horizontal
        scrollEnabled
        showsButtons={false}
      >
        <TouchableOpacity
          style={styles.slide}
          onPress={() => handleNavigation("Coupon 1")}
        >
          <Image source={coupon1} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.slide}
          onPress={() => handleNavigation("Coupon 3")}
        >
          <Image source={coupon3} style={styles.image} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.slide}
          onPress={() => handleNavigation("Coupon 2")}
        >
          <Image source={coupon2} style={styles.image} />
        </TouchableOpacity>
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  swiperContainer: {
    height: 200,
    width: 340,
    borderRadius: 10,
    overflow: "hidden",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default SwiperView;
