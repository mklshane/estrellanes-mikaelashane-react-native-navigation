import React, { useMemo } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Props } from "../../navigation/props";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { resolveImageSource } from "../../data/imageMap";
import { formatCurrency } from "../../utils/formatters";

const CartScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const {
    items,
    increment,
    decrement,
    removeFromCart,
    totalPrice,
  } = useCart();

  const deliveryNote = "Free shipping";

  const formattedTotal = useMemo(
    () => formatCurrency(totalPrice),
    [totalPrice]
  );

  const renderItem = (itemId: string, name: string, subtitle: string, price: number, qty: number, image?: any) => (
    <View key={itemId} style={[styles.itemRow, { borderColor: colors.border }]}> 
      <View style={styles.itemLeft}>
        {image ? (
          <Image source={image} style={styles.itemImage} resizeMode="cover" />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface }]}>
            <Text style={{ color: colors.mutedText }}>No image</Text>
          </View>
        )}
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.itemSubtitle, { color: colors.mutedText }]} numberOfLines={1}>
            {subtitle}
          </Text>
          <Text style={[styles.itemPrice, { color: colors.text }]}>{formatCurrency(price)}</Text>
        </View>
      </View>

      <View style={styles.itemRight}>
        <Pressable onPress={() => removeFromCart(itemId)} hitSlop={10}>
          <Text style={{ color: colors.mutedText, fontSize: 18 }}>×</Text>
        </Pressable>
        <View style={[styles.qtyControl, { borderColor: colors.border }]}> 
          <Pressable
            style={styles.qtyBtn}
            hitSlop={8}
            onPress={() => decrement(itemId)}
          >
            <Text style={[styles.qtyText, { color: colors.text }]}>−</Text>
          </Pressable>
          <Text style={[styles.qtyValue, { color: colors.text }]}>{qty}</Text>
          <Pressable
            style={styles.qtyBtn}
            hitSlop={8}
            onPress={() => increment(itemId)}
          >
            <Text style={[styles.qtyText, { color: colors.text }]}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.container, { backgroundColor: colors.background }]}> 

            {items.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: colors.mutedText }]}>
                  Your cart is empty.
                </Text>
              </View>
            ) : (
              <View style={styles.listBlock}>
                {items.map(({ product, quantity }) =>
                  renderItem(
                    product.id,
                    product.name,
                    product.description,
                    product.price,
                    quantity,
                    resolveImageSource(product.images?.[0])
                  )
                )}
              </View>
            )}

          
          </View>
        </ScrollView>

        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
            },
          ]}
        >
          <View style={styles.totalRow}>
            <View>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
              <Text style={[styles.subNote, { color: colors.mutedText }]}>Order and get reward points</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.totalValue, { color: colors.text }]}>{formattedTotal}</Text>
              <Text style={[styles.subNote, { color: colors.mutedText }]}>{deliveryNote}</Text>
            </View>
          </View>

          <Pressable
            style={[styles.checkoutBtn, { backgroundColor: isDarkMode ? colors.text : "#0F172A" }]}
            onPress={() => navigation.navigate("Checkout")}
          >
            <Text style={[styles.checkoutText, { color: isDarkMode ? colors.background : "#FFFFFF" }]}>Proceed to Checkout</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  listBlock: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 16,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  itemImage: {
    width: 76,
    height: 76,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
  },
  itemSubtitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "700",
  },
  itemRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 12,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyText: {
    fontSize: 20,
    fontWeight: "700",
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 20,
    textAlign: "center",
  },
  coupon: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  couponRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  couponInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 10,
  },
  couponBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  couponBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  totalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  bottomBar: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  subNote: {
    fontSize: 12,
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  checkoutBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "700",
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default CartScreen;
