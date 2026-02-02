import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types";
import { useTheme } from "../context/ThemeContext";

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

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={resetAndClose}
    >
      <Pressable style={styles.backdrop} onPress={resetAndClose}>
        <Pressable
          style={[
            styles.sheet,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Add to Cart
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>
            {product?.name}
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
            <Pressable onPress={decrement} hitSlop={12}>
              <Ionicons name="remove" size={20} color={colors.text} />
            </Pressable>
            <Text style={[styles.qtyValue, { color: colors.text }]}>
              {qty}
            </Text>
            <Pressable onPress={increment} hitSlop={12}>
              <Ionicons name="add" size={20} color={colors.text} />
            </Pressable>
          </View>

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
              <Text
                style={[
                  styles.primaryText,
                  {
                    color: "#000000",
                  },
                ]}
              >
                Add to Cart
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    marginVertical: 8,
  },
  qtyValue: {
    fontSize: 18,
    fontWeight: "800",
    minWidth: 40,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    fontSize: 15,
    fontWeight: "700",
  },
});

export default AddToCartModal;
