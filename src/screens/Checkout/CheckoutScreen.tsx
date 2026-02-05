import React, { useMemo, useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions } from "@react-navigation/native";
import { Props } from "../../navigation/props";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { resolveImageSource } from "../../data/imageMap";
import OrderItem from "../../components/OrderItem";
import OrderSummary from "../../components/OrderSummary";
import SuccessModal from "../../components/SuccessModal";
import { styles } from "./Checkout.styles";

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

export default CheckoutScreen;
