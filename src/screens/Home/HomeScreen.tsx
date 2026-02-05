import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Props } from "../../navigation/props";
import products from "../../data/products.json";
import ProductCard from "../../components/ProductCard";
import { Product } from "../../types";
import { useTheme } from "../../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";
import CartButton from "../../components/CartButton";
import SearchBar from "../../components/SearchBar";

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { addToCart, totalItems } = useCart();
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products as Product[];
    return (products as Product[]).filter((item) =>
      item.name.toLowerCase().includes(q)
    );
  }, [query]);

  type GridItem = Product & { __empty?: boolean };

  const gridData = useMemo(() => {
    const data = [...filteredProducts] as GridItem[];
    if (data.length % 2 === 1) {
      data.push({
        id: "__placeholder__",
        name: "",
        price: 0,
        images: [],
        description: "",
        __empty: true,
      } as GridItem);
    }
    return data;
  }, [filteredProducts]);

  const renderItem = ({ item }: { item: GridItem }) => {
    if (item.__empty) {
      return <View style={[styles.column, styles.placeholderColumn]} />;
    }

    return (
      <View style={styles.column}>
        <ProductCard
          product={item}
          onPress={() => {
            navigation.navigate("ProductDetails", { id: item.id });
          }}
          onAddToCart={(product, quantity = 1) => addToCart(product, quantity)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ backgroundColor: colors.background, flex: 1 }}
    >
      <View style={styles.searchRow}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          wrapperStyle={styles.searchWrapper}
        />
        <CartButton
          count={totalItems}
          onPress={() => navigation.navigate("Shopping Cart")}
        />
      </View>
      <FlatList
        data={gridData}
        keyExtractor={(item, index) => item.id || `placeholder-${index}`}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No matches found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedText }]}>
              Try a different keyword.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  searchWrapper: {
    flex: 1,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  row: {
    gap: 14,
    paddingHorizontal: 12,
  },
  column: {
    flex: 1,
  },
  placeholderColumn: {
    opacity: 0,
  },
  listContent: {
    gap: 14,
    paddingBottom: 32,
    paddingTop: 10,
  },
  emptyState: {
    paddingTop: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default HomeScreen;