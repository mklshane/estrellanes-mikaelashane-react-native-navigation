import React from "react";
import { Image, StyleSheet, Text, View, ImageSourcePropType } from "react-native";
import { CartItem as CartItemType } from "../../types";
import { formatCurrency } from "../../utils/formatters";
import { ThemeColors } from "../../styles/colors";

interface OrderItemProps {
  item: CartItemType;
  colors: ThemeColors;
  image?: ImageSourcePropType | null;
}

const OrderItem: React.FC<OrderItemProps> = ({ item, colors, image }) => {
  const { product, quantity } = item;

  return (
    <View style={[styles.itemCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <View style={styles.itemContent}>
        <View style={styles.itemImageWrapper}>
          {image ? (
            <Image source={image} style={styles.itemImage} resizeMode="cover" />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface }]}>
              <Text style={{ color: colors.mutedText }}>No image</Text>
            </View>
          )}
        </View>

        <View style={styles.itemDetails}>
          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={[styles.itemSubtitle, { color: colors.mutedText }]} numberOfLines={1}>
            {product.description}
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.itemPrice, { color: colors.text }]}>
              {formatCurrency(product.price)}
            </Text>
            <Text style={[styles.quantityBadge, { color: colors.mutedText }]}>
              × {quantity}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.totalPrice}>
        <Text style={[styles.totalPriceText, { color: colors.text }]}>
          {formatCurrency(product.price * quantity)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  itemImageWrapper: {
    width: 70,
    height: 70,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemDetails: {
    flex: 1,
    gap: 3,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  itemSubtitle: {
    fontSize: 10,
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: "700",
  },
  quantityBadge: {
    fontSize: 11,
    fontWeight: "600",
  },
  totalPrice: {
    alignItems: "flex-end",
  },
  totalPriceText: {
    fontSize: 13,
    fontWeight: "800",
  },
});

export default OrderItem;
