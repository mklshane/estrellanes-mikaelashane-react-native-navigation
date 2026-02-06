import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { resolveImageSource } from "../../data/imageMap";
import { styles } from "../../screens/ProductDetails/ProductDetails.styles";
import type { ThemeColors } from "../../styles/colors";

const { width } = Dimensions.get("window");

type ImageCarouselProps = {
  images: string[];
  colors: ThemeColors;
  currentImageIndex: number;
  onIndexChange: (index: number) => void;
  carouselRef: React.RefObject<FlatList<string> | null>;
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  colors,
  currentImageIndex,
  onIndexChange,
  carouselRef,
}) => {
  return (
    <View style={styles.imageStage}>
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
          onIndexChange(index);
        }}
        style={{
          backgroundColor: colors.surface,
          width: "100%",
          height: "100%",
        }}
      />

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
                    index === currentImageIndex ? colors.text : colors.border,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default ImageCarousel;
