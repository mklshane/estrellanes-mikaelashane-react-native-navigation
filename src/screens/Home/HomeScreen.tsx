import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Props } from "../../navigation/props";
import products from "../../data/products.json";
import ProductCard from "../../components/ProductCard";
import { Product } from "../../types";
import { useTheme } from "../../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products as Product[];
    return (products as Product[]).filter((item) =>
      item.name.toLowerCase().includes(q)
    );
  }, [query]);

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.column}>
      <ProductCard
        product={item}
        onPress={() => {
          // navigation.navigate("ProductDetail", { id: item.id });
        }}
        onAddToCart={() => {
          // cart logic
        }}
      />
    </View>
  );

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ backgroundColor: colors.background, flex: 1 }}
    >
      <View style={styles.headerWrapper}>
      <Text style={[styles.title, { color: colors.text }]}>Discover</Text>
      <Text style={[styles.subtitle, { color: colors.mutedText }]}>
        Curated picks for your daily essentials
      </Text>

     
    </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  search: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    fontSize: 15,
    fontWeight: "600",
  },
  row: {
    gap: 14,
    paddingHorizontal: 12,
  },
  column: {
    flex: 1,
  },
  listContent: {
    gap: 14,
    paddingBottom: 32,
    paddingTop: 10,
  },
});

export default HomeScreen;