import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../../utils/formatters";
import { styles } from "../../screens/ProductDetails/ProductDetails.styles";
import type { ThemeColors } from "../../styles/colors";
import type { Product } from "../../types";

type ProductInfoSectionProps = {
  product: Product;
  colors: ThemeColors;
};

const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  product,
  colors,
}) => {
  return (
    <View style={styles.infoSection}>
      <View
        style={[
          styles.headerCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.productName, { color: colors.text }]}>
          {product.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.text }]}>
            {formatCurrency(product.price)}
          </Text>
          {product.averageRating && (
            <View
              style={[
                styles.ratingPill,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={[styles.ratingPillText, { color: colors.text }]}>
                {product.averageRating.toFixed(1)}
              </Text>
              {product.reviewCount && (
                <Text
                  style={[
                    styles.ratingCountText,
                    { color: colors.mutedText },
                  ]}
                >
                  ({product.reviewCount})
                </Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.infoPillsRow}>
          <View
            style={[
              styles.infoPill,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color={colors.text}
            />
            <Text style={[styles.infoPillText, { color: colors.text }]}>
              In stock
            </Text>
          </View>
          <View
            style={[
              styles.infoPill,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons name="car-outline" size={16} color={colors.text} />
            <Text style={[styles.infoPillText, { color: colors.text }]}>
              Free delivery
            </Text>
          </View>
        </View>
      </View>

      {product.variations && product.variations.length > 0 && (
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Available Options
          </Text>
          {product.variations.map((variation) => (
            <View key={variation.name} style={styles.variationRow}>
              <Text
                style={[styles.variationName, { color: colors.mutedText }]}
              >
                {variation.name}:
              </Text>
              <Text style={[styles.variationOptions, { color: colors.text }]}>
                {variation.options.join(", ")}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View
        style={[
          styles.sectionCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.descriptionTitle, { color: colors.text }]}>
          About this product
        </Text>
        <Text style={[styles.description, { color: colors.mutedText }]}>
          {product.description}
        </Text>
      </View>
    </View>
  );
};

export default ProductInfoSection;
