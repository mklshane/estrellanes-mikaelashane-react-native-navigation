import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Product } from "../types";
import { useTheme } from "../context/ThemeContext";
import { resolveImageSource } from "../data/imageMap";
import AddToCartModal from "./AddToCartModal";
import { formatCurrency } from "../utils/formatters";

type Props = {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
};

const ProductCard: React.FC<Props> = ({ product, onPress, onAddToCart }) => {
  const { colors, isDarkMode } = useTheme();
  const firstImage = product.images?.[0];
  const imageSource = resolveImageSource(firstImage);
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = (p: Product, qty: number) => {
    onAddToCart?.(p, qty);
  };

  return (
    <Pressable
      onPress={() => onPress?.(product)}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: isDarkMode ? "#000" : "#0f172a33",
        },
      ]}
    >
      {imageSource ? (
        <Image
          source={imageSource}
          style={[styles.image, { backgroundColor: colors.surface }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface }]}> 
          <Text style={{ color: colors.mutedText }}>No image</Text>
        </View>
      )}

      <View style={styles.infoRow}>
        <View style={styles.infoText}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={[styles.price, { color: colors.text }]}>
            {formatCurrency(product.price)}
          </Text>
        </View>

        <Pressable
          onPress={() => setShowModal(true)}
          style={[
            styles.circleBtn,
            {
              backgroundColor: isDarkMode ? "#ececec" : "#0F172A",
            },
          ]}
        >
          <Text
            style={[
              styles.circleText,
              {
                color: colors.primaryText,
              },
            ]}
          >
            +
          </Text>
        </Pressable>
      </View>

      <AddToCartModal
        visible={showModal}
        product={product}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#F1F1F1",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  infoRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  infoText: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "400",
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
  },
  circleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    fontSize: 20,
    fontWeight: "400",
    lineHeight: 22,
  },
});

export default ProductCard;