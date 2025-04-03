import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Provider } from "react-redux";
import store from "../../store";

export default function Layout() {
  return (
    <Provider store={store}>
      <Tabs>
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <FontAwesome name="home" size={25} color="#b1b4e6" />
              ) : (
                <FontAwesome name="home" size={25} color="black" />
              ),
          }}
        />

        <Tabs.Screen
          name="basket"
          options={{
            tabBarLabel: "Basket",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="basket" size={27} color="#777bbb" />
              ) : (
                <Ionicons name="basket" size={27} color="black" />
              ),
          }}
        />

        <Tabs.Screen
          name="orders"
          options={{
            tabBarLabel: "Orders",
            tabBarLabelStyle: { color: "black" },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="bag-check" size={24} color="#777bbb" />
              ) : (
                <Ionicons name="bag-check" size={24} color="black" />
              ),
          }}
        />
      </Tabs>
    </Provider>
  );
}
