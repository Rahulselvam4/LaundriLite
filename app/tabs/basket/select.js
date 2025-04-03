import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Octicons, AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import dryclean from "../../../assets/dryclean.png";
import DressItem from "../../../components/dressItem";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
} from "../../../redux/CartReducer";

const select = () => {
  const router = useRouter();
  const cart = useSelector((state) => state.cart.cart);
  const total = cart
    ?.map((item) => item.item.price * item.item.quantity)
    .reduce((prev, curr) => prev + curr, 0);
  const [option, setOption] = useState("Men");
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("Wash + fold");

  const menData = [
    {
      id: "0",
      image: "https://cdn-icons-png.flaticon.com/128/776/776623.png",
      name: "Pant",
      price: 75,
    },
    {
      id: "8",
      image: "https://cdn-icons-png.flaticon.com/128/919/919439.png",
      name: "Shorts",
      price: 85,
    },
    {
      id: "1",
      image: "https://cdn-icons-png.flaticon.com/128/6669/6669281.png",
      name: "Dhoti",
      price: 80,
    },

    {
      id: "2",
      image: "https://cdn-icons-png.flaticon.com/128/2806/2806102.png",
      name: "Half T-Shirt",
      price: 60,
    },
    {
      id: "3",
      image: "https://cdn-icons-png.flaticon.com/128/7378/7378841.png",
      name: "Shirt",
      price: 85,
    },
    {
      id: "4",
      image: "https://cdn-icons-png.flaticon.com/128/3381/3381515.png",
      name: "Suit",
      price: 150,
    },
    {
      id: "5",
      image: "https://cdn-icons-png.flaticon.com/128/2589/2589797.png",
      name: "Blazer",
      price: 130,
    },
    {
      id: "6",
      image: "https://cdn-icons-png.flaticon.com/128/3827/3827006.png",
      name: "Sweater",
      price: 90,
    },
    {
      id: "7",
      image: "https://cdn-icons-png.flaticon.com/128/2806/2806051.png",
      name: "Jacket",
      price: 120,
    },
  ];

  const womenData = [
    {
      id: "10",
      image: "https://cdn-icons-png.flaticon.com/128/1348/1348247.png",
      name: "Jeans",
      price: 75,
    },

    {
      id: "12",
      image: "https://cdn-icons-png.flaticon.com/128/5258/5258076.png",
      name: "Sweatshirt",
      price: 60,
    },
    {
      id: "13",
      image: "https://cdn-icons-png.flaticon.com/128/2806/2806198.png",
      name: "Leggings",
      price: 85,
    },
    {
      id: "14",
      image: "https://cdn-icons-png.flaticon.com/128/6642/6642032.png",
      name: "Blazer",
      price: 85,
    },
    {
      id: "11",
      image: "https://cdn-icons-png.flaticon.com/128/17206/17206061.png",
      name: "Kurta",
      price: 80,
    },
    {
      id: "15",
      image: "https://cdn-icons-png.flaticon.com/128/3515/3515854.png",
      name: "Tops",
      price: 85,
    },
    {
      id: "16",
      image: "https://cdn-icons-png.flaticon.com/128/17981/17981822.png",
      name: "Saree",
      price: 100,
    },
    {
      id: "17",
      image: "https://cdn-icons-png.flaticon.com/128/2093/2093930.png",
      name: "Jumpsuit",
      price: 100,
    },
    {
      id: "18",
      image: "https://cdn-icons-png.flaticon.com/128/1774/1774825.png",
      name: "Skirt",
      price: 90,
    },
    {
      id: "19",
      image: "https://cdn-icons-png.flaticon.com/128/3751/3751538.png",
      name: "Dress",
      price: 110,
    },
  ];
  const kidsData = [
    {
      id: "20",
      image: "https://cdn-icons-png.flaticon.com/128/6609/6609556.png",
      name: "Kids Dress",
      price: 75,
    },
    {
      id: "21",
      image: "https://cdn-icons-png.flaticon.com/128/1083/1083825.png",
      name: "Kids Frock Dress",
      price: 80,
    },

    {
      id: "22",
      image: "https://cdn-icons-png.flaticon.com/128/405/405130.png",
      name: "Kids T-Shirt ",
      price: 60,
    },
    {
      id: "23",
      image: "https://cdn-icons-png.flaticon.com/128/9338/9338575.png",
      name: "Kids Sweater",
      price: 85,
    },
    {
      id: "24",
      image: "https://cdn-icons-png.flaticon.com/128/8761/8761274.png",
      name: "Kids Jeans",
      price: 70,
    },
    {
      id: "25",
      image: "https://cdn-icons-png.flaticon.com/128/2383/2383070.png",
      name: "Kids Pajamas",
      price: 75,
    },
  ];
  const houseData = [
    {
      id: "30",
      image: "https://cdn-icons-png.flaticon.com/128/2679/2679164.png",
      name: "Apron",
      price: 75,
    },
    {
      id: "31",
      image: "https://cdn-icons-png.flaticon.com/128/6013/6013970.png",
      name: "Bath Towel",
      price: 80,
    },

    {
      id: "32",
      image: "https://cdn-icons-png.flaticon.com/128/3445/3445548.png",
      name: "Mats",
      price: 60,
    },
    {
      id: "33",
      image: "https://cdn-icons-png.flaticon.com/128/9752/9752725.png",
      name: "Pillow covers",
      price: 85,
    },
    {
      id: "34",
      image: "https://cdn-icons-png.flaticon.com/128/7061/7061555.png",
      name: "Bed Sheets",
      price: 150,
    },
    {
      id: "35",
      image: "https://cdn-icons-png.flaticon.com/128/3419/3419945.png",
      name: "Curtains",
      price: 200,
    },
    {
      id: "36",
      image: "https://cdn-icons-png.flaticon.com/128/1271/1271209.png",
      name: "Tablecloths",
      price: 100,
    },
    {
      id: "37",
      image: "https://cdn-icons-png.flaticon.com/128/3821/3821935.png",
      name: "Duvet Covers",
      price: 250,
    },
    {
      id: "38",
      image: "https://cdn-icons-png.flaticon.com/128/8515/8515918.png",
      name: "Cushion Covers",
      price: 90,
    },
  ];
  const sportsGearData = [
    {
      id: "39",
      image: "https://cdn-icons-png.flaticon.com/128/9552/9552127.png",
      name: "Jersey/Uniform ",
      price: 85,
    },
    {
      id: "40",
      image: "https://cdn-icons-png.flaticon.com/128/10652/10652485.png",
      name: "Yoga Wear ",
      price: 75,
    },
    {
      id: "41",
      image: "https://cdn-icons-png.flaticon.com/128/1576/1576070.png",
      name: "Cycling Wear ",
      price: 95,
    },
    {
      id: "42",
      image: "https://cdn-icons-png.flaticon.com/128/1974/1974052.png",
      name: "Hiking Apparel",
      price: 110,
    },
  ];

  const delicatesData = [
    {
      id: "43",
      image: "https://cdn-icons-png.flaticon.com/128/7040/7040439.png",
      name: "Lingerie",
      price: 25,
    },
    {
      id: "44",
      image: "https://cdn-icons-png.flaticon.com/128/17246/17246158.png",
      name: "Hosiery",
      price: 25,
    },
    {
      id: "45",
      image: "https://cdn-icons-png.flaticon.com/128/13968/13968493.png",
      name: "Shapewear ",
      price: 70,
    },
    {
      id: "46",
      image: "https://cdn-icons-png.flaticon.com/128/5414/5414408.png",
      name: "Silk Garments",
      price: 150,
    },
    {
      id: "47",
      image: "https://cdn-icons-png.flaticon.com/128/7076/7076250.png",
      name: "Lace Clothing ",
      price: 130,
    },
  ];
  const accessoriesData = [
    {
      id: "64",
      image: "https://cdn-icons-png.flaticon.com/128/843/843877.png",
      name: "Socks",
      price: 50,
    },
    {
      id: "49",
      image: "https://cdn-icons-png.flaticon.com/128/2912/2912436.png",
      name: "Belt ",
      price: 50,
    },
    {
      id: "50",
      image: "https://cdn-icons-png.flaticon.com/128/3004/3004618.png",
      name: "Bowtie",
      price: 40,
    },
    {
      id: "51",
      image: "https://cdn-icons-png.flaticon.com/128/12322/12322382.png",
      name: "Headband",
      price: 30,
    },
    {
      id: "52",
      image: "https://cdn-icons-png.flaticon.com/128/3904/3904757.png",
      name: "Handkerchief",
      price: 15,
    },
    {
      id: "53",
      image: "https://cdn-icons-png.flaticon.com/128/1177/1177015.png",
      name: "Suspenders",
      price: 45,
    },
    {
      id: "62",
      image: "https://cdn-icons-png.flaticon.com/128/14973/14973756.png",
      name: "Tie",
      price: 40,
    },
    {
      id: "63",
      image: "https://cdn-icons-png.flaticon.com/128/16832/16832225.png",
      name: "Scarf",
      price: 50,
    },
  ];
  const petData = [
    {
      id: "54",
      image: "https://cdn-icons-png.flaticon.com/128/1650/1650601.png",
      name: "Pet Bed ",
      price: 200,
    },
    {
      id: "55",
      image: "https://cdn-icons-png.flaticon.com/128/4877/4877407.png",
      name: "Pet Blanket ",
      price: 150,
    },
    {
      id: "57",
      image: "https://cdn-icons-png.flaticon.com/128/8876/8876295.png",
      name: "Pet Clothing ",
      price: 120,
    },
    {
      id: "59",
      image: "https://cdn-icons-png.flaticon.com/128/15536/15536778.png",
      name: "Pet Bag",
      price: 250,
    },
    {
      id: "60",
      image: "https://cdn-icons-png.flaticon.com/128/4310/4310635.png",
      name: "Pet leash",
      price: 300,
    },
   
  ];

  return (
    <>
      <ScrollView>
        <View style={{ backgroundColor: "#dbddff", padding: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
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
                <Ionicons name="chevron-back-outline" size={24} color="black" />
              </Pressable>
              <Text style={{ fontSize: 18, fontWeight: 500 }}>
                Laundry list
              </Text>
            </View>
            
          </View>
        </View>

        <View
          style={{
            marginTop: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Pressable
            onPress={() => setSelectedOption("Wash + fold")}
            style={{
              backgroundColor: "white",
              width: 80,
              height: 80,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
              borderWidth: 1,
              borderColor:
                selectedOption == "Wash + fold" ? "#0066b2" : "transparent",
            }}
          >
            <Image
              style={{ width: 40, height: 40 }}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/7769/7769829.png",
              }}
            />
            <Text style={{ textAlign: "center", fontSize: 12, marginTop: 5 }}>
              Wash + fold
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedOption("Wash + Iron")}
            style={{
              backgroundColor: "white",
              width: 80,
              height: 80,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
              borderWidth: 1,
              borderColor:
                selectedOption == "Wash + Iron" ? "#0066b2" : "transparent",
            }}
          >
            <Image
              style={{ width: 40, height: 40 }}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/802/802826.png",
              }}
            />
            <Text style={{ textAlign: "center", fontSize: 12, marginTop: 5 }}>
              Wash + Iron
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedOption("Steam Iron")}
            style={{
              backgroundColor: "white",
              width: 80,
              height: 80,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
              borderWidth: 1,
              borderColor:
                selectedOption == "Steam Iron" ? "#0066b2" : "transparent",
            }}
          >
            <Image
              style={{ width: 40, height: 40 }}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/12299/12299913.png",
              }}
            />
            <Text style={{ textAlign: "center", fontSize: 12, marginTop: 5 }}>
              Steam Iron
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedOption("Dry Clean")}
            style={{
              backgroundColor: "white",
              width: 80,
              height: 80,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
              borderWidth: 1,
              borderColor:
                selectedOption == "Dry Clean" ? "#0066b2" : "transparent",
            }}
          >
            <Image style={{ width: 40, height: 40 }} source={dryclean} />
            <Text style={{ textAlign: "center", fontSize: 12, marginTop: 5 }}>
              Dry Clean
            </Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View
              style={{
                marginVertical: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                justifyContent: "space-around",
              }}
            >
              <Pressable
                onPress={() => setOption("Men")}
                style={{
                  padding: 10,
                  backgroundColor: option == "Men" ? "#0066b2" : "white",
                  width: 60,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    textAlign: "center",
                    color: option == "Men" ? "white" : "gray",
                  }}
                >
                  Men
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setOption("Women")}
                style={{
                  padding: 10,
                  backgroundColor: "white",
                  backgroundColor: option == "Women" ? "#0066b2" : "white",
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    textAlign: "center",
                    color: option == "Women" ? "white" : "gray",
                  }}
                >
                  Women
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setOption("Kids")}
                style={{
                  padding: 10,
                  backgroundColor: "white",
                  width: 60,
                  backgroundColor: option == "Kids" ? "#0066b2" : "white",
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    textAlign: "center",
                    color: option == "Kids" ? "white" : "gray",
                  }}
                >
                  Kids
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setOption("Household")}
                style={{
                  padding: 10,
                  backgroundColor: "white",
                  backgroundColor: option == "Household" ? "#0066b2" : "white",
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    textAlign: "center",
                    color: option == "Household" ? "white" : "gray",
                  }}
                >
                  Household
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setOption("Sports")}
                style={{
                  padding: 10,
                  backgroundColor: "white",
                  backgroundColor: option == "Sports" ? "#0066b2" : "white",
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    textAlign: "center",
                    color: option == "Sports" ? "white" : "gray",
                  }}
                >
                  SportsWear
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setOption("Delicates")}
                style={{
                  padding: 10,
                  backgroundColor: "white",
                  backgroundColor: option == "Delicates" ? "#0066b2" : "white",
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    textAlign: "center",
                    color: option == "Delicates" ? "white" : "gray",
                  }}
                >
                  Delicates
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setOption("Accessories")}
                style={{
                  padding: 10,
                  backgroundColor: "white",
                  backgroundColor:
                    option == "Accessories" ? "#0066b2" : "white",
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    textAlign: "center",
                    color: option == "Accessories" ? "white" : "gray",
                  }}
                >
                  Accessories
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setOption("Pets")}
                style={{
                  padding: 10,
                  backgroundColor: "white",
                  backgroundColor: option == "Pets" ? "#0066b2" : "white",
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    textAlign: "center",
                    color: option == "Pets" ? "white" : "gray",
                  }}
                >
                  Pets
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View style={{ marginHorizontal: 10 }}>
          {option == "Men" && (
            <View>
              {menData?.map((item, index) => (
                <DressItem
                  item={item}
                  selectedOption={selectedOption}
                  key={index}
                />
              ))}
            </View>
          )}
        </View>

        <View style={{ marginHorizontal: 10 }}>
          {option == "Women" && (
            <View>
              {womenData?.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    padding: 10,
                    backgroundColor: "white",
                    marginVertical: 13,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View>
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={{ uri: item?.image }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "500" }}>
                      {item?.name}
                    </Text>
                    <Text style={{ marginTop: 3 }}>
                      {" "}
                      {selectedOption == "Wash + Iron"
                        ? item.price + 20
                        : selectedOption == "Steam Iron"
                        ? item.price + 35
                        : selectedOption == "Dry Clean"
                        ? item.price + 45
                        : item.price}
                    </Text>
                  </View>

                  {cart.some((c) => c.item.id == item.id) ? (
                    <Pressable
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        alignItems: "center",
                        borderRadius: 5,
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          dispatch(decrementQuantity(item));
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 25,
                            paddingHorizontal: 6,
                          }}
                        >
                          -
                        </Text>
                      </Pressable>

                      <Pressable>
                        <Text
                          style={{
                            color: "black",
                            paddingHorizontal: 6,
                            fontSize: 15,
                          }}
                        >
                          {
                            cart.find((c) => c.item.id === item.id)?.item
                              .quantity
                          }
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => {
                          dispatch(incrementQuantity(item));
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 17,
                            color: "black",
                            paddingHorizontal: 6,
                          }}
                        >
                          +
                        </Text>
                      </Pressable>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => {
                        dispatch(addToCart({ item, category: selectedOption }));
                      }}
                    >
                      <AntDesign name="pluscircleo" size={24} color="grey" />
                    </Pressable>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>
        <View style={{ marginHorizontal: 10 }}>
          {option == "Kids" && (
            <View>
              {kidsData?.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    padding: 10,
                    backgroundColor: "white",
                    marginVertical: 13,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View>
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={{ uri: item?.image }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "500" }}>
                      {item?.name}
                    </Text>
                    <Text style={{ marginTop: 3 }}>
                      Rs{" "}
                      {selectedOption == "Wash + Iron"
                        ? item.price + 20
                        : selectedOption == "Steam Iron"
                        ? item.price + 35
                        : selectedOption == "Dry Clean"
                        ? item.price + 45
                        : item.price}
                    </Text>
                  </View>
                  {cart.some((c) => c.item.id == item.id) ? (
                    <Pressable
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        alignItems: "center",
                        borderRadius: 5,
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          dispatch(decrementQuantity(item));
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 25,
                            paddingHorizontal: 6,
                          }}
                        >
                          -
                        </Text>
                      </Pressable>

                      <Pressable>
                        <Text
                          style={{
                            color: "black",
                            paddingHorizontal: 6,
                            fontSize: 15,
                          }}
                        >
                          {
                            cart.find((c) => c.item.id === item.id)?.item
                              .quantity
                          }
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => {
                          dispatch(incrementQuantity(item));
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 17,
                            color: "black",
                            paddingHorizontal: 6,
                          }}
                        >
                          +
                        </Text>
                      </Pressable>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => {
                        dispatch(addToCart({ item, category: selectedOption }));
                      }}
                    >
                      <AntDesign name="pluscircleo" size={24} color="grey" />
                    </Pressable>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>
        <View style={{ marginHorizontal: 10 }}>
          {option == "Accessories" && (
            <View>
              {accessoriesData?.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    padding: 10,
                    backgroundColor: "white",
                    marginVertical: 13,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View>
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={{ uri: item?.image }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "500" }}>
                      {item?.name}
                    </Text>
                    <Text style={{ marginTop: 3 }}>
                      Rs{" "}
                      {selectedOption == "Wash + Iron"
                        ? item.price + 20
                        : selectedOption == "Steam Iron"
                        ? item.price + 35
                        : selectedOption == "Dry Clean"
                        ? item.price + 45
                        : item.price}
                    </Text>
                  </View>
                  {cart.some((c) => c.item.id == item.id) ? (
                    <Pressable
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        alignItems: "center",
                        borderRadius: 5,
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          dispatch(decrementQuantity(item));
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 25,
                            paddingHorizontal: 6,
                          }}
                        >
                          -
                        </Text>
                      </Pressable>

                      <Pressable>
                        <Text
                          style={{
                            color: "black",
                            paddingHorizontal: 6,
                            fontSize: 15,
                          }}
                        >
                          {
                            cart.find((c) => c.item.id === item.id)?.item
                              .quantity
                          }
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => {
                          dispatch(incrementQuantity(item));
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 17,
                            color: "black",
                            paddingHorizontal: 6,
                          }}
                        >
                          +
                        </Text>
                      </Pressable>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => {
                        dispatch(addToCart({ item, category: selectedOption }));
                      }}
                    >
                      <AntDesign name="pluscircleo" size={24} color="grey" />
                    </Pressable>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>
        <View style={{ marginHorizontal: 10 }}>
          {option == "Household" && (
            <View>
              {houseData?.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    padding: 10,
                    backgroundColor: "white",
                    marginVertical: 13,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View>
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={{ uri: item?.image }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "500" }}>
                      {item?.name}
                    </Text>
                    <Text style={{ marginTop: 3 }}>
                      Rs{" "}
                      {selectedOption == "Wash + Iron"
                        ? item.price + 20
                        : selectedOption == "Steam Iron"
                        ? item.price + 35
                        : selectedOption == "Dry Clean"
                        ? item.price + 45
                        : item.price}
                    </Text>
                  </View>
                  {cart.some((c) => c.item.id == item.id) ? (
                    <Pressable
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        alignItems: "center",
                        borderRadius: 5,
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          dispatch(decrementQuantity(item));
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 25,
                            paddingHorizontal: 6,
                          }}
                        >
                          -
                        </Text>
                      </Pressable>

                      <Pressable>
                        <Text
                          style={{
                            color: "black",
                            paddingHorizontal: 6,
                            fontSize: 15,
                          }}
                        >
                          {
                            cart.find((c) => c.item.id === item.id)?.item
                              .quantity
                          }
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => {
                          dispatch(incrementQuantity(item));
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 17,
                            color: "black",
                            paddingHorizontal: 6,
                          }}
                        >
                          +
                        </Text>
                      </Pressable>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => {
                        dispatch(addToCart({ item, category: selectedOption }));
                      }}
                    >
                      <AntDesign name="pluscircleo" size={24} color="grey" />
                    </Pressable>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={{ marginHorizontal: 10 }}>
          {option == "Sports" && (
            <View>
              {sportsGearData?.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    padding: 10,
                    backgroundColor: "white",
                    marginVertical: 13,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View>
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={{ uri: item?.image }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "500" }}>
                      {item?.name}
                    </Text>
                    <Text style={{ marginTop: 3 }}>
                      Rs{" "}
                      {selectedOption == "Wash + Iron"
                        ? item.price + 20
                        : selectedOption == "Steam Iron"
                        ? item.price + 35
                        : selectedOption == "Dry Clean"
                        ? item.price + 45
                        : item.price}
                    </Text>
                  </View>
                  {cart.some((c) => c.item.id == item.id) ? (
                    <Pressable
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        alignItems: "center",
                        borderRadius: 5,
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          dispatch(decrementQuantity(item));
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 25,
                            paddingHorizontal: 6,
                          }}
                        >
                          -
                        </Text>
                      </Pressable>

                      <Pressable>
                        <Text
                          style={{
                            color: "black",
                            paddingHorizontal: 6,
                            fontSize: 15,
                          }}
                        >
                          {
                            cart.find((c) => c.item.id === item.id)?.item
                              .quantity
                          }
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => {
                          dispatch(incrementQuantity(item));
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 17,
                            color: "black",
                            paddingHorizontal: 6,
                          }}
                        >
                          +
                        </Text>
                      </Pressable>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => {
                        dispatch(addToCart({ item, category: selectedOption }));
                      }}
                    >
                      <AntDesign name="pluscircleo" size={24} color="grey" />
                    </Pressable>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={{ marginHorizontal: 10 }}>
          {option == "Delicates" && (
            <View>
              {delicatesData?.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    padding: 10,
                    backgroundColor: "white",
                    marginVertical: 13,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View>
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={{ uri: item?.image }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "500" }}>
                      {item?.name}
                    </Text>
                    <Text style={{ marginTop: 3 }}>
                      Rs{" "}
                      {selectedOption == "Wash + Iron"
                        ? item.price + 20
                        : selectedOption == "Steam Iron"
                        ? item.price + 35
                        : selectedOption == "Dry Clean"
                        ? item.price + 45
                        : item.price}
                    </Text>
                  </View>
                  {cart.some((c) => c.item.id == item.id) ? (
                    <Pressable
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        alignItems: "center",
                        borderRadius: 5,
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          dispatch(decrementQuantity(item));
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 25,
                            paddingHorizontal: 6,
                          }}
                        >
                          -
                        </Text>
                      </Pressable>

                      <Pressable>
                        <Text
                          style={{
                            color: "black",
                            paddingHorizontal: 6,
                            fontSize: 15,
                          }}
                        >
                          {
                            cart.find((c) => c.item.id === item.id)?.item
                              .quantity
                          }
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => {
                          dispatch(incrementQuantity(item));
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 17,
                            color: "black",
                            paddingHorizontal: 6,
                          }}
                        >
                          +
                        </Text>
                      </Pressable>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => {
                        dispatch(addToCart({ item, category: selectedOption }));
                      }}
                    >
                      <AntDesign name="pluscircleo" size={24} color="grey" />
                    </Pressable>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={{ marginHorizontal: 10 }}>
          {option == "Pets" && (
            <View>
              {petData?.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    padding: 10,
                    backgroundColor: "white",
                    marginVertical: 13,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View>
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={{ uri: item?.image }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "500" }}>
                      {item?.name}
                    </Text>
                    <Text style={{ marginTop: 3 }}>
                      Rs{" "}
                      {selectedOption == "Wash + Iron"
                        ? item.price + 0
                        : selectedOption == "Steam Iron"
                        ? item.price + 0
                        : selectedOption == "Dry Clean"
                        ? item.price + 0
                        : item.price}
                    </Text>
                  </View>
                  {cart.some((c) => c.item.id == item.id) ? (
                    <Pressable
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        alignItems: "center",
                        borderRadius: 5,
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          dispatch(decrementQuantity(item));
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 25,
                            paddingHorizontal: 6,
                          }}
                        >
                          -
                        </Text>
                      </Pressable>

                      <Pressable>
                        <Text
                          style={{
                            color: "black",
                            paddingHorizontal: 6,
                            fontSize: 15,
                          }}
                        >
                          {
                            cart.find((c) => c.item.id === item.id)?.item
                              .quantity
                          }
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => {
                          dispatch(incrementQuantity(item));
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 17,
                            color: "black",
                            paddingHorizontal: 6,
                          }}
                        >
                          +
                        </Text>
                      </Pressable>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => {
                        dispatch(addToCart({ item, category: selectedOption }));
                      }}
                    >
                      <AntDesign name="pluscircleo" size={24} color="grey" />
                    </Pressable>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

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
              <Ionicons name="basket" size={24} color="black" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "600" }}>
                Basket Total Rs {total}
              </Text>
              <Text style={{ fontSize: 13, fontWeight: "500", marginTop: 3 }}>
                You have {cart.length} items saved in your basket
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/tabs/basket/cart")}
              style={{
                padding: 10,
                backgroundColor: "#C5E1A5",
                borderRadius: 4,
              }}
            >
              <Text>View</Text>
            </Pressable>
          </View>
        </Pressable>
      )}
    </>
  );
};

export default select;

const styles = StyleSheet.create({});
