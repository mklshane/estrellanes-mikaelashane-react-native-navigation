import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { CartItem as CartItemType } from "../types";
import { formatCurrency } from "../utils/formatters";

interface CartItemProps {
  item: CartItemType;
  isSelected: boolean;
  colors: any;
  isDarkMode: boolean;
  onToggleSelect: (productId: string) => void;
  onRemove: (productId: string) => void;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  image?: any;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  isSelected,
  colors,
  isDarkMode,
  onToggleSelect,
  onRemove,
  onIncrement,
  onDecrement,
  image,
}) => {
  const { product, quantity } = item;

  return (
    <View
      style={[
        styles.itemCard,
        {
          borderColor: isSelected ? "#0F172A" : colors.border,
          backgroundColor: isSelected
            ? isDarkMode
              ? "#1a1a1a"
              : "#f5f5f5"
            : colors.card,
          borderWidth: isSelected ? 2 : 1,
        },
      ]}
    >
      <Pressable
        onPress={() => onToggleSelect(product.id)}
        hitSlop={10}
        style={styles.checkboxContainer}
      >
        <View
          style={[
            styles.checkbox,
            {
              borderColor: colors.border,
              backgroundColor: isSelected ? "#0F172A" : "transparent",
            },
          ]}
        >
          {isSelected && (
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
              ✓
            </Text>
          )}
        </View>
      </Pressable>

      <View style={styles.itemContent}>
        <View style={styles.itemImageWrapper}>
          {image ? (
            <Image source={image} style={styles.itemImage} resizeMode="cover" />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text style={{ color: colors.mutedText }}>No image</Text>
            </View>
          )}
        </View>

        <View style={styles.itemDetails}>
          <Text
            style={[styles.itemName, { color: colors.text }]}
            numberOfLines={2}
          >
            {product.name}
          </Text>
          <Text
            style={[styles.itemSubtitle, { color: colors.mutedText }]}
            numberOfLines={1}
          >
            {product.description}
          </Text>
          <Text style={[styles.itemPrice, { color: colors.text }]}>
            {formatCurrency(product.price)}
          </Text>
        </View>
      </View>

      <View style={styles.itemActions}>
        <Pressable
          onPress={() => onRemove(product.id)}
          hitSlop={10}
          style={styles.deleteBtn}
        >
          <Text style={{ color: colors.mutedText, fontSize: 18 }}>×</Text>
        </Pressable>
        <View style={[styles.qtyControl, { borderColor: colors.border }]}>
          <Pressable
            style={styles.qtyBtn}
            hitSlop={8}
            onPress={() => onDecrement(product.id)}
          >
            <Text style={[styles.qtyText, { color: colors.text }]}>−</Text>
          </Pressable>
          <Text style={[styles.qtyValue, { color: colors.text }]}>
            {quantity}
          </Text>
          <Pressable
            style={styles.qtyBtn}
            hitSlop={8}
            onPress={() => onIncrement(product.id)}
          >
            <Text style={[styles.qtyText, { color: colors.text }]}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    gap: 12,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  checkboxContainer: {
    marginRight: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  itemImageWrapper: {
    width: 80,
    height: 80,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  itemDetails: {
    flex: 1,
    gap: 4,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  itemSubtitle: {
    fontSize: 11,
    fontWeight: "500",
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "700",
  },
  itemActions: {
    alignItems: "flex-end",
    gap: 8,
  },
  deleteBtn: {
    padding: 4,
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
  },
  qtyBtn: {
    padding: 4,
    minWidth: 24,
    alignItems: "center",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "700",
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 18,
    textAlign: "center",
  },
});

export default CartItem;
