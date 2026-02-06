import React, { useMemo, useCallback } from "react";
import {
  Pressable,
  FlatList,
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
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./Cart.styles";

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
              globalStyles.emptyContainer,
              styles.emptyContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={[globalStyles.emptyIconWrapper, styles.emptyIconWrapper]}>
              <Text style={styles.emptyIcon}>🛒</Text>
            </View>
            <Text style={[globalStyles.emptyTitle, styles.emptyTitle, { color: colors.text }]}>
              Your Cart is Empty
            </Text>
            <Text style={[globalStyles.emptySubtitle, styles.emptySubtitle, { color: colors.mutedText }]}>
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
            globalStyles.bottomBar,
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
              globalStyles.checkoutBtn,
              styles.checkoutBtn,
              {
                backgroundColor:
                  selectedCount === 0 ? colors.mutedText : colors.ctaPeach,
                opacity: selectedCount === 0 ? 0.5 : 1,
              },
            ]}
            onPress={() => selectedCount > 0 && navigation.navigate("Checkout")}
            disabled={selectedCount === 0}
          >
            <Text
              style={[
                globalStyles.checkoutText,
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

export default CartScreen;
