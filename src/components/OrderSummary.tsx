import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "../utils/formatters";

interface OrderSummaryProps {
  subtotal: number;
  shippingFee?: number;
  discount?: number;
  tax?: number;
  colors: any;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shippingFee = 0,
  discount = 0,
  tax = 0,
  colors,
}) => {
  const total = subtotal + shippingFee - discount + tax;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.summaryRow}>
        <Text style={[styles.label, { color: colors.text }]}>
          Total
        </Text>
        <Text style={[styles.value, { color: colors.text, fontWeight: "700" }]}>
          {formatCurrency(total)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
  },
  value: {
    fontSize: 18,
    fontWeight: "800",
  },
});

export default OrderSummary;
