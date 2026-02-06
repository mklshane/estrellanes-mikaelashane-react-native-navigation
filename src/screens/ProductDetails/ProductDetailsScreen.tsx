import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Props } from "../../navigation/props";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import products from "../../data/products.json";
import { Product } from "../../types";
import AddToCartModal from "../../components/AddToCartModal";
import { styles } from "./ProductDetails.styles";
import BottomBar from "../../components/ProductDetails/BottomBar";
import ImageCarousel from "../../components/ProductDetails/ImageCarousel";
import ProductInfoSection from "../../components/ProductDetails/ProductInfoSection";
import ThumbnailCarousel from "../../components/ProductDetails/ThumbnailCarousel";

const ProductDetailsScreen: React.FC<Props> = ({ navigation, route }: any) => {
  const { colors, isDarkMode } = useTheme();
  const { addToCart, totalItems } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const carouselRef = useRef<FlatList<string> | null>(null);

  const productId = route?.params?.id;
  const product = products.find(
    (p: Product) => p.id === productId
  ) as Product | undefined;

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={[
            styles.errorContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Text style={{ color: colors.text }}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const images = product.images || [];
  const { width } = Dimensions.get("window");

  // Set header options with product name
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: product.name,
      headerTitleStyle: { color: colors.text },
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
    });
  }, [navigation, product.name, colors]);

  const handleAddToCart = (p: Product, qty: number) => {
    addToCart(p, qty);
    setShowModal(false);
  };

  const scrollToImageIndex = (index: number) => {
    carouselRef.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
  };


  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ImageCarousel
          images={images}
          colors={colors}
          currentImageIndex={currentImageIndex}
          onIndexChange={setCurrentImageIndex}
          carouselRef={carouselRef}
        />

        {/* Thumbnail Carousel */}
        {images.length > 1 && (
          <View style={styles.thumbnailsContainer}>
            <ThumbnailCarousel
              images={images}
              colors={colors}
              currentImageIndex={currentImageIndex}
              onSelectIndex={setCurrentImageIndex}
              onScrollToIndex={scrollToImageIndex}
            />
          </View>
        )}

        <ProductInfoSection product={product} colors={colors} />
      </ScrollView>

      {/* Bottom Bar */}
      <BottomBar
        colors={colors}
        totalItems={totalItems}
        onAddToCartPress={() => setShowModal(true)}
        onCartPress={() => navigation.navigate("Cart")}
        addButtonTextColor={isDarkMode ? colors.background : "#0F172A"}
      />

      <AddToCartModal
        visible={showModal}
        product={product}
        onClose={() => setShowModal(false)}
        onConfirm={handleAddToCart}
      />
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;
