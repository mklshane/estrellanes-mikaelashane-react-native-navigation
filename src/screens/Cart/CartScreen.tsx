import React, { useMemo, useCallback } from "react";
import {
  Pressable,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Props } from "../../navigation/props";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import { resolveImageSource } from "../../data/imageMap";
import { formatCurrency } from "../../utils/formatters";
import CartItem from "../../components/CartItem";

const CartScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const {
    items,
    increment,
    decrement,
    removeFromCart,
    toggleSelectItem,
    selectAllItems,
    deselectAllItems,
    isItemSelected,
    selectedCount,
    selectedTotalPrice,
    totalItems,
  } = useCart();

  const deliveryNote = "Free shipping";

  const formattedSelectedTotal = useMemo(
    () => formatCurrency(selectedTotalPrice),
    [selectedTotalPrice]
  );

  const isAllSelected = useMemo(
    () => items.length > 0 && items.every((item) => isItemSelected(item.product.id)),
    [items, isItemSelected]
  );

  const handleSelectAll = () => {
    if (isAllSelected) {
      deselectAllItems();
    } else {
      selectAllItems();
    }
  };

  const renderItem = useCallback(({ item }: any) => {
    const isSelected = isItemSelected(item.product.id);
    const image = resolveImageSource(item.product.images?.[0]);

    return (
      <CartItem
        item={item}
        isSelected={isSelected}
        colors={colors}
        isDarkMode={isDarkMode}
        onToggleSelect={toggleSelectItem}
        onRemove={removeFromCart}
        onIncrement={increment}
        onDecrement={decrement}
        image={image}
      />
    );
  }, [colors, isDarkMode, isItemSelected, toggleSelectItem, removeFromCart, decrement, increment]);

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View style={{ flex: 1 }}>
        {items.length === 0 ? (
          <View
            style={[
              styles.emptyContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={styles.emptyIconWrapper}>
              <Text style={styles.emptyIcon}>🛒</Text>
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Your Cart is Empty
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedText }]}>
              Add items from our store to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContent}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View
                style={[
                  styles.selectAllRow,
                  { borderColor: colors.border, backgroundColor: colors.card },
                ]}
              >
                <Pressable
                  onPress={handleSelectAll}
                  style={styles.selectAllControl}
                  hitSlop={10}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: colors.border,
                        backgroundColor: isAllSelected
                          ? "#0F172A"
                          : "transparent",
                      },
                    ]}
                  >
                    {isAllSelected && (
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 14,
                          fontWeight: "700",
                        }}
                      >
                        ✓
                      </Text>
                    )}
                  </View>
                  <Text style={[styles.selectAllText, { color: colors.text }]}>
                    Select All {items.length > 0 && `(${items.length})`}
                  </Text>
                </Pressable>
              </View>
            }
            ItemSeparatorComponent={() => <View style={styles.itemGap} />}
          />
        )}
      </View>

      {items.length > 0 && (
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
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Selected ({selectedCount})
              </Text>
              <Text style={[styles.subNote, { color: colors.mutedText }]}>
                {deliveryNote}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.totalValue, { color: colors.text }]}>
                {formattedSelectedTotal}
              </Text>
              
            </View>
          </View>

          <Pressable
            style={[
              styles.checkoutBtn,
              {
                backgroundColor:
                  selectedCount === 0 ? colors.mutedText : "#81D14F",
                opacity: selectedCount === 0 ? 0.5 : 1,
              },
            ]}
            onPress={() => selectedCount > 0 && navigation.navigate("Checkout")}
            disabled={selectedCount === 0}
          >
            <Text
              style={[
                styles.checkoutText,
                { color: isDarkMode ? colors.background : "#000000" },
              ]}
            >
              Proceed to Checkout ({selectedCount})
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  itemCount: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  flatListContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
  },
  itemGap: {
    height: 10,
  },
  selectAllRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 4,
    gap: 10,
  },
  selectAllControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  selectAllText: {
    fontSize: 15,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.05)",
  },
  emptyIcon: {
    fontSize: 56,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
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
});

export default CartScreen;
