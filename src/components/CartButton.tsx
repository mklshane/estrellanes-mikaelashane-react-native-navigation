import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface CartButtonProps {
  count: number;
  onPress: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ count, onPress }) => {
  const { isDarkMode } = useTheme();

  const backgroundColor = isDarkMode ? "#FFFFFF" : "#0F172A";
  const iconColor = isDarkMode ? "#0F172A" : "#FFFFFF";

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={[styles.button, { backgroundColor }]}
    >
      <Ionicons name="cart-outline" size={22} color={iconColor} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});

export default CartButton;
