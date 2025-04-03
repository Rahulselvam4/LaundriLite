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

// import React from "react";
// import { View, Image, StyleSheet } from "react-native";
// import Swiper from "react-native-swiper";
// import coupon1 from "../../../assets/Coupon1111.png";
// import coupon2 from "../../../assets/Coupon211.jpg";
// import coupon3 from "../../../assets/Coupon3w.jpg";

// const SwiperView = () => {
//   return (
//     <View style={styles.swiperContainer}>
//       <Swiper
//         autoplay
//         autoplayTimeout={3}
//         showsPagination={true}
//         activeDotColor="#b1b4e6"
//         loop={true}
//         horizontal={true}
//         scrollEnabled={true}
//         showsButtons={false}
//       >
//         <View style={styles.slide}>
//           <Image source={coupon1} style={styles.image} />
//         </View>
//         <View style={styles.slide}>
//           <Image source={coupon3} style={styles.image} />
//         </View>
//         <View style={styles.slide}>
//           <Image source={coupon2} style={styles.image} />
//         </View>
//       </Swiper>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   swiperContainer: {
//     height: 200,
//     width: 340,
//     borderRadius: 10,
//     overflow: "hidden",
//   },
//   slide: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "white",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//   },
// });

// export default SwiperView;

// import React, { useState } from "react";
// import { View, Image, StyleSheet } from "react-native";
// import Swiper from "react-native-swiper";
// import coupon1 from "../../../assets/Coupon1111.png";
// import coupon2 from "../../../assets/Coupon211.jpg";
// import coupon3 from "../../../assets/Coupon3w.jpg";

// const SwiperView = () => {
//   const [index, setIndex] = useState(0); // Track current slide index

//   return (
//     <View style={styles.swiperContainer}>
//       <Swiper
//         autoplay
//         autoplayTimeout={3} // Auto-slide every 3 seconds
//         showsPagination={true}
//         loop={true}
//         index={index} // Allow manual swipe control
//         onIndexChanged={(i) => setIndex(i)} // Detect manual swipes
//         horizontal={true} // Ensure left-right swiping
//         showsButtons={false} // Set to true if you want navigation arrows
//       >
//         <View style={styles.slide}>
//           <Image source={coupon1} style={styles.image} />
//         </View>
//         <View style={styles.slide}>
//           <Image source={coupon3} style={styles.image} />
//         </View>
//         <View style={styles.slide}>
//           <Image source={coupon2} style={styles.image} />
//         </View>
//       </Swiper>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   swiperContainer: {
//     height: 200,
//     width: 340,
//     borderRadius: 10,
//     overflow: "hidden",
//     flex: 1, // ✅ Allow touch gestures
//   },
//   slide: {
//     backgroundColor: "white",
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//   },
// });

// export default SwiperView;
