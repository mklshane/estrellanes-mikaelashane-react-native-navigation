import React from "react";
import { Pressable, Text, View } from "react-native";
import CartButton from "../CartButton";
import { styles } from "../../screens/ProductDetails/ProductDetails.styles";
import type { ThemeColors } from "../../styles/colors";

type BottomBarProps = {
  colors: ThemeColors;
  totalItems: number;
  onAddToCartPress: () => void;
  onCartPress: () => void;
  addButtonTextColor: string;
};

const BottomBar: React.FC<BottomBarProps> = ({
  colors,
  totalItems,
  onAddToCartPress,
  onCartPress,
  addButtonTextColor,
}) => {
  return (
    <View
      style={[
        styles.bottomBar,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      ]}
    >
      <Pressable
        onPress={onAddToCartPress}
        style={[
          styles.addToCartBtn,
          {
            backgroundColor: colors.ctaPeach,
          },
        ]}
      >
        <Text style={[styles.addToCartText, { color: addButtonTextColor }]}
        >
          Add to Cart
        </Text>
      </Pressable>

      <CartButton count={totalItems} onPress={onCartPress} />
    </View>
  );
};

export default BottomBar;
