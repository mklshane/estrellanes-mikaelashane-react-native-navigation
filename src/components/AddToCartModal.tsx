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
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});

  const resetAndClose = () => {
    setQty(1);
    setSelectedVariations({});
    onClose();
  };

  const handleConfirm = () => {
    if (!product) return;
    
    // Check if all variations are selected
    if (product.variations && product.variations.length > 0) {
      const allVariationsSelected = product.variations.every(
        (variation) => selectedVariations[variation.name]
      );
      if (!allVariationsSelected) {
        return; // Don't proceed if not all variations are selected
      }
    }
    
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
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: colors.text }]}>
                Add to Cart
              </Text>
              <Text style={[styles.subtitle, { color: colors.mutedText }]}>
                {product?.name}
              </Text>
            </View>
            
          </View>

          {/* Variations */}
          {product?.variations && product.variations.length > 0 && (
            <View style={styles.variationsContainer}>
              {product.variations.map((variation) => (
                <View key={variation.name} style={styles.variationGroup}>
                  <Text style={[styles.variationLabel, { color: colors.text }]}>
                    {variation.name}
                  </Text>
                  <View style={styles.optionsGrid}>
                    {variation.options.map((option) => {
                      const isSelected = selectedVariations[variation.name] === option;
                      return (
                        <Pressable
                          key={option}
                          onPress={() => setSelectedVariations(prev => ({ ...prev, [variation.name]: option }))}
                          style={[
                            styles.optionChip,
                            {
                              borderColor: isSelected ? colors.text : colors.border,
                              backgroundColor: isSelected ? colors.ctaPeach : colors.surface,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              {
                                color: isSelected ? "#1F2937" : colors.text,
                              },
                            ]}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          )}

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
              <Ionicons name="remove" size={18} color={colors.text} />
            </Pressable>
            <Text style={[styles.qtyValue, { color: colors.text }]}>
              {qty}
            </Text>
            <Pressable onPress={increment} hitSlop={12}>
              <Ionicons name="add" size={18} color={colors.text} />
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
              disabled={
                product?.variations &&
                product.variations.length > 0 &&
                !product.variations.every(
                  (variation) => selectedVariations[variation.name]
                )
              }
              style={[
                styles.primaryBtn,
                {
                  backgroundColor:
                    product?.variations &&
                    product.variations.length > 0 &&
                    !product.variations.every(
                      (variation) => selectedVariations[variation.name]
                    )
                      ? colors.mutedText
                      : colors.ctaPeach,
                  opacity:
                    product?.variations &&
                    product.variations.length > 0 &&
                    !product.variations.every(
                      (variation) => selectedVariations[variation.name]
                    )
                      ? 0.5
                      : 1,
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
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
    gap: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  variationsContainer: {
    gap: 16,
    marginVertical: 8,
  },
  variationGroup: {
    gap: 8,
  },
  variationLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  optionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    marginVertical: 6,
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
    marginTop: 6,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
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
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    fontSize: 15,
    fontWeight: "700",
  },
});

export default AddToCartModal;
