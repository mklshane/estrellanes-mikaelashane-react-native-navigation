import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
          <Text style={[styles.title, { color: colors.text }]}>Add to cart</Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>Choose quantity for {product?.name}</Text>

          <View style={[styles.qtyControl, { borderColor: colors.border }]}> 
            <Pressable style={styles.qtyBtn} onPress={decrement} hitSlop={8}>
              <Text style={[styles.qtyText, { color: colors.text }]}>−</Text>
            </Pressable>
            <Text style={[styles.qtyValue, { color: colors.text }]}>{qty}</Text>
            <Pressable style={styles.qtyBtn} onPress={increment} hitSlop={8}>
              <Text style={[styles.qtyText, { color: colors.text }]}>+</Text>
            </Pressable>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={resetAndClose}
              style={[styles.secondaryBtn, { borderColor: colors.border }]}
              hitSlop={6}
            >
              <Text style={[styles.secondaryText, { color: colors.text }]}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              style={[
                styles.primaryBtn,
                { backgroundColor: isDarkMode ? colors.text : "#0F172A" },
              ]}
              hitSlop={6}
            >
              <Text style={[styles.primaryText, { color: isDarkMode ? colors.background : "#FFFFFF" }]}>Add</Text>
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
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 16,
  },
  qtyBtn: {
    padding: 8,
  },
  qtyText: {
    fontSize: 20,
    fontWeight: "700",
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 32,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: "700",
  },
  primaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  primaryText: {
    fontSize: 15,
    fontWeight: "700",
  },
});

export default AddToCartModal;
