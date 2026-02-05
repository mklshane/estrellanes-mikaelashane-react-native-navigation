import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Props } from "../../navigation/props";
import { useTheme } from "../../context/ThemeContext";
import { useCart } from "../../context/CartContext";
import CartButton from "../../components/CartButton";
import { resolveImageSource } from "../../data/imageMap";
import products from "../../data/products.json";
import { Product } from "../../types";
import { formatCurrency } from "../../utils/formatters";
import AddToCartModal from "../../components/AddToCartModal";

const { width } = Dimensions.get("window");

const ProductDetailsScreen: React.FC<Props> = ({ navigation, route }: any) => {
  const { colors, isDarkMode } = useTheme();
  const { addToCart, totalItems } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const carouselRef = useRef<any>(null);

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
  const currentImage = resolveImageSource(images[currentImageIndex]);

  const handleAddToCart = (p: Product, qty: number) => {
    addToCart(p, qty);
    setShowModal(false);
  };

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

  const renderImageThumbnail = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => {
    const imageSource = resolveImageSource(item);
    const isActive = index === currentImageIndex;

    return (
      <Pressable
        onPress={() => {
          setCurrentImageIndex(index);

          carouselRef.current?.scrollToOffset({
            offset: index * width,
            animated: true,
          });
        }}
        style={[
          styles.thumbnail,
          {
            borderColor: isActive ? colors.text : colors.border,
            borderWidth: isActive ? 2 : 1,
            backgroundColor: colors.surface,
          },
        ]}
      >
        {imageSource ? (
          <Image source={imageSource} style={styles.thumbnailImage} />
        ) : (
          <Text style={{ color: colors.mutedText }}>No image</Text>
        )}
      </Pressable>
    );
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
        {/* Image Carousel Container */}
        <View style={{ position: "relative", width: "100%", aspectRatio: 1 }}>
          {/* Main Image Carousel */}
          <FlatList
            ref={carouselRef}
            data={images}
            renderItem={({ item }) => {
              const imageSource = resolveImageSource(item);
              return (
                <View style={[{ width: width, height: "100%" }]}>
                  {imageSource ? (
                    <Image source={imageSource} style={styles.mainImage} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={{ color: colors.mutedText }}>No image</Text>
                    </View>
                  )}
                </View>
              );
            }}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const contentOffsetX = e.nativeEvent.contentOffset.x;
              const index = Math.round(contentOffsetX / width);
              setCurrentImageIndex(index);
            }}
            style={{
              backgroundColor: colors.surface,
              width: "100%",
              height: "100%",
            }}
          />

          {/* Image Indicators */}
          {images.length > 0 && (
            <View style={styles.indicatorsContainer}>
              {images.map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    carouselRef.current?.scrollToOffset({
                      offset: index * width,
                      animated: true,
                    });
                  }}
                  hitSlop={10}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor:
                        index === currentImageIndex
                          ? colors.text
                          : colors.border,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Thumbnail Carousel */}
        {images.length > 1 && (
          <View style={styles.thumbnailsContainer}>
            <FlatList
              data={images}
              renderItem={({ item, index }) =>
                renderImageThumbnail({ item, index })
              }
              keyExtractor={(_, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailsContent}
              scrollEnabled={images.length > 3}
            />
          </View>
        )}

        {/* Product Info */}
        <View style={styles.infoSection}>

          <Text style={[styles.productName, { color: colors.text }]}>
            {product.name}
          </Text>

          {/* Rating and Reviews (if available) */}
          {product.averageRating && (
            <View style={styles.ratingRow}>
              <View style={styles.ratingStars}>
                <Ionicons name="star" size={16} color="#FFB800" />
                <Text
                  style={[
                    styles.ratingText,
                    { color: colors.text, marginLeft: 4 },
                  ]}
                >
                  {product.averageRating.toFixed(1)}
                </Text>
              </View>
              {product.reviewCount && (
                <Text style={[styles.reviewCount, { color: colors.mutedText }]}>
                  ({product.reviewCount} Reviews)
                </Text>
              )}
            </View>
          )}

          {/* Price */}
          <Text style={[styles.price, { color: colors.text }]}>
            {formatCurrency(product.price)}
          </Text>

          {/* Variations */}
          {product.variations && product.variations.length > 0 && (
            <View style={styles.variationsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Available Options
              </Text>
              {product.variations.map((variation) => (
                <View key={variation.name} style={styles.variationRow}>
                  <Text style={[styles.variationName, { color: colors.mutedText }]}>
                    {variation.name}:
                  </Text>
                  <Text style={[styles.variationOptions, { color: colors.text }]}>
                    {variation.options.join(", ")}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={[styles.descriptionTitle, { color: colors.text }]}>
              About this product
            </Text>
            <Text style={[styles.description, { color: colors.mutedText }]}>
              {product.description}
            </Text>
          </View>

          {/* Placeholder Info Items */}
          <View style={styles.infoItems}>
            <View
              style={[
                styles.infoItem,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={colors.text}
              />
              <Text style={[styles.infoItemText, { color: colors.text }]}>
                In stock
              </Text>
            </View>

            <View
              style={[
                styles.infoItem,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Ionicons name="car-outline" size={20} color={colors.text} />
              <Text style={[styles.infoItemText, { color: colors.text }]}>
                Free delivery
              </Text>
            </View>

            <View
              style={[
                styles.infoItem,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Ionicons name="location-outline" size={20} color={colors.text} />
              <Text style={[styles.infoItemText, { color: colors.text }]}>
                Available in nearest store
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={() => setShowModal(true)}
          style={[
            styles.addToCartBtn,
            {
              backgroundColor: colors.ctaGreen,
            },
          ]}
        >
          <Text
            style={[
              styles.addToCartText,
              {
                color: isDarkMode ? colors.background : "#0F172A",
              },
            ]}
          >
            Add to Cart
          </Text>
        </Pressable>

        <CartButton
          count={totalItems}
          onPress={() => navigation.navigate("Shopping Cart")}
        />
      </View>

      <AddToCartModal
        visible={showModal}
        product={product}
        onClose={() => setShowModal(false)}
        onConfirm={handleAddToCart}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imageCarouselContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  mainImageWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorsContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  thumbnailsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  thumbnailsContent: {
    gap: 10,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  infoSection: {
    paddingHorizontal: 16,
    gap: 12,
  },
  productName: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
  },
  reviewCount: {
    fontSize: 14,
    fontWeight: "500",
  },
  price: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },
  variationsSection: {
    gap: 8,
    marginTop: 8,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  variationRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  variationName: {
    fontSize: 13,
    fontWeight: "600",
  },
  variationOptions: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  descriptionContainer: {
    gap: 8,
    marginTop: 4,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  infoItems: {
    gap: 8,
    marginTop: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
  },
  infoItemText: {
    fontSize: 13,
    fontWeight: "600",
  },
  bottomBar: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  addToCartBtn: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "700",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductDetailsScreen;
