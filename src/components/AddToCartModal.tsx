import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types";
import { useTheme } from "../context/ThemeContext";
import { formatCurrency } from "../utils/formatters";

interface AddToCartModalProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (product: Product, quantity: number) => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  visible,
  product,
  onClose,
  onConfirm,
}) => {
  const { colors, isDarkMode } = useTheme();
  const [qty, setQty] = useState(1);
  const [scaleAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible, scaleAnim]);

  const resetAndClose = () => {
    setQty(1);
    onClose();
  };

  const handleConfirm = () => {
    if (!product) return;
    onConfirm(product, Math.max(1, qty));
    resetAndClose();
  };

  const increment = () => setQty((n) => n + 1);
  const decrement = () => setQty((n) => Math.max(1, n - 1));

  const totalPrice = product ? product.price * qty : 0;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={resetAndClose}
    >
      <Pressable style={styles.backdrop} onPress={resetAndClose}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                {
                  scale: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Pressable
            style={[
              styles.sheet,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={[styles.title, { color: colors.text }]}>
                  Add to Cart
                </Text>
                <Text style={[styles.subtitle, { color: colors.mutedText }]}>
                  {product?.name}
                </Text>
              </View>
              <Pressable
                onPress={resetAndClose}
                hitSlop={12}
                style={[
                  styles.closeBtn,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </Pressable>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Quantity Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.text }]}>
                Quantity
              </Text>
              <View
                style={[
                  styles.qtyControl,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <Pressable
                  style={[styles.qtyBtn, { borderRightColor: colors.border }]}
                  onPress={decrement}
                  hitSlop={12}
                >
                  <Ionicons name="remove" size={20} color={colors.text} />
                </Pressable>
                <Text style={[styles.qtyValue, { color: colors.text }]}>
                  {qty}
                </Text>
                <Pressable
                  style={[styles.qtyBtn, { borderLeftColor: colors.border }]}
                  onPress={increment}
                  hitSlop={12}
                >
                  <Ionicons name="add" size={20} color={colors.text} />
                </Pressable>
              </View>
            </View>

            {/* Price Section */}
            <View
              style={[
                styles.priceSection,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: colors.mutedText }]}>
                  Unit Price
                </Text>
                <Text style={[styles.price, { color: colors.text }]}>
                  {formatCurrency(product?.price || 0)}
                </Text>
              </View>
              <View style={[styles.priceDivider, { backgroundColor: colors.border }]} />
              <View style={styles.priceRow}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>
                  Total
                </Text>
                <Text style={[styles.totalPrice, { color: colors.text }]}>
                  {formatCurrency(totalPrice)}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable
                onPress={resetAndClose}
                style={[
                  styles.secondaryBtn,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <Text style={[styles.secondaryText, { color: colors.text }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={handleConfirm}
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor: "#81D14F",
                  },
                ]}
              >
                <Ionicons
                  name="bag-add"
                  size={18}
                  color={isDarkMode ? colors.background : "#000000"}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.primaryText,
                    {
                      color: isDarkMode ? colors.background : "#000000",
                    },
                  ]}
                >
                  Add to Cart
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  container: {
    width: "100%",
  },
  sheet: {
    width: "100%",
    borderRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 10,
    gap: 16,
  },
  qtyBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  qtyValue: {
    fontSize: 18,
    fontWeight: "800",
    minWidth: 40,
    textAlign: "center",
  },
  priceSection: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
  },
  priceDivider: {
    height: 1,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "800",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "700",
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "700",
  },
});

export default AddToCartModal;
