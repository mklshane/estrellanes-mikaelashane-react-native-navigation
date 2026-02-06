import React, { useState, useEffect, useRef } from "react";
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
        <View style={styles.imageStage}>
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
          <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.productName, { color: colors.text }]}>
              {product.name}
            </Text>

            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: colors.text }]}>
                {formatCurrency(product.price)}
              </Text>
              {product.averageRating && (
                <View style={[styles.ratingPill, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <Ionicons name="star" size={14} color="#FFB800" />
                  <Text style={[styles.ratingPillText, { color: colors.text }]}>
                    {product.averageRating.toFixed(1)}
                  </Text>
                  {product.reviewCount && (
                    <Text style={[styles.ratingCountText, { color: colors.mutedText }]}
                    >
                      ({product.reviewCount})
                    </Text>
                  )}
                </View>
              )}
            </View>

            <View style={styles.infoPillsRow}>
              <View style={[styles.infoPill, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.text} />
                <Text style={[styles.infoPillText, { color: colors.text }]}>In stock</Text>
              </View>
              <View style={[styles.infoPill, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Ionicons name="car-outline" size={16} color={colors.text} />
                <Text style={[styles.infoPillText, { color: colors.text }]}>Free delivery</Text>
              </View>
            </View>
          </View>

          {/* Variations */}
          {product.variations && product.variations.length > 0 && (
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
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
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.descriptionTitle, { color: colors.text }]}>
              About this product
            </Text>
            <Text style={[styles.description, { color: colors.mutedText }]}>
              {product.description}
            </Text>
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
              backgroundColor: colors.ctaPeach,
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
          onPress={() => navigation.navigate("Cart")}
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
