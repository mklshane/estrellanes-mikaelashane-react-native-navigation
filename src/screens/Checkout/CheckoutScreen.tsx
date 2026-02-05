import React, { useMemo, useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions } from "@react-navigation/native";
import { Props } from "../../navigation/props";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { resolveImageSource } from "../../data/imageMap";
import OrderItem from "../../components/OrderItem";
import OrderSummary from "../../components/OrderSummary";
import SuccessModal from "../../components/SuccessModal";

const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { selectedItems, selectedTotalPrice, clearCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const renderItem = useCallback(({ item }: any) => {
    const image = resolveImageSource(item.product.images?.[0]);
    return <OrderItem item={item} colors={colors} image={image} />;
  }, [colors]);

  const handleCheckout = () => {
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    clearCart();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
  };

  const isLoading = false; 

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <SuccessModal
        visible={showSuccess}
        message="Order Placed Successfully!"
        onDismiss={handleSuccessClose}
        duration={2000}
        colors={colors}
      />
      <View style={{ flex: 1 }}>
        {selectedItems.length === 0 ? (
          <View
            style={[
              styles.emptyContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={styles.emptyIconWrapper}>
              <Text style={styles.emptyIcon}>📦</Text>
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Items to Checkout
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.mutedText }]}
            >
              Please select items from your cart
            </Text>
          </View>
        ) : (
          <FlatList
            data={selectedItems}
            keyExtractor={(item) => item.product.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text, marginBottom: 12 },
                ]}
              >
                Order Items ({selectedItems.length})
              </Text>
            }
            ItemSeparatorComponent={() => <View style={styles.itemGap} />}
          />
        )}
      </View>

      {selectedItems.length > 0 && (
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
            },
          ]}
        >
          <OrderSummary
            subtotal={selectedTotalPrice}
            colors={colors}
          />
          
          <Pressable
            style={[
              styles.checkoutBtn,
              {
                backgroundColor: colors.ctaGreen,
                opacity: isLoading ? 0.6 : 1,
              },
            ]}
            onPress={handleCheckout}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.checkoutText,
                { color: isDarkMode ? colors.background : "#000000" },
              ]}
            >
              {isLoading ? "Processing..." : "Place Order"}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  itemGap: {
    height: 8,
  },
  footerSection: {
    marginTop: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.05)",
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 18,
  },
  bottomBar: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
  checkoutBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "700",
  },
  cancelBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1.5,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
  },
});

export default CheckoutScreen;
