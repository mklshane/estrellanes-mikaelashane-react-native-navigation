import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
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
import { styles } from "./ProductDetails.styles";

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

export default ProductDetailsScreen;
