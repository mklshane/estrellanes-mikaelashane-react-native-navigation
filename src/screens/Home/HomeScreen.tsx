import React, { useMemo, useState } from "react";
import { FlatList, Keyboard, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Props } from "../../navigation/props";
import products from "../../data/products.json";
import ProductCard from "../../components/Home/ProductCard";
import { Product } from "../../types";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import CartButton from "../../components/CartButton";
import SearchBar from "../../components/Home/SearchBar";
import EmptyState from "../../components/Home/EmptyState";
import { styles } from "./Home.styles";

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
      <Pressable onPress={Keyboard.dismiss} accessible={false} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.searchRow}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              wrapperStyle={styles.searchWrapper}
            />
            <CartButton
              count={totalItems}
              onPress={() => navigation.navigate("Cart")}
            />
          </View>
          <FlatList
            data={gridData}
            keyExtractor={(item, index) => item.id || `placeholder-${index}`}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<EmptyState />}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default HomeScreen;