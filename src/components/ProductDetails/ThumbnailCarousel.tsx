import React from "react";
import { FlatList, Image, Pressable, Text } from "react-native";
import { resolveImageSource } from "../../data/imageMap";
import { styles } from "../../screens/ProductDetails/ProductDetails.styles";
import type { ThemeColors } from "../../styles/colors";

const ITEM_SIZE = 70;

type ThumbnailCarouselProps = {
  images: string[];
  colors: ThemeColors;
  currentImageIndex: number;
  onSelectIndex: (index: number) => void;
  onScrollToIndex: (index: number) => void;
};

const ThumbnailCarousel: React.FC<ThumbnailCarouselProps> = ({
  images,
  colors,
  currentImageIndex,
  onSelectIndex,
  onScrollToIndex,
}) => {
  return (
    <FlatList
      data={images}
      renderItem={({ item, index }) => {
        const imageSource = resolveImageSource(item);
        const isActive = index === currentImageIndex;

        return (
          <Pressable
            onPress={() => {
              onSelectIndex(index);
              onScrollToIndex(index);
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
      }}
      keyExtractor={(_, index) => index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.thumbnailsContent}
      scrollEnabled={images.length > 3}
      getItemLayout={(_, index) => ({
        length: ITEM_SIZE,
        offset: ITEM_SIZE * index,
        index,
      })}
    />
  );
};

export default ThumbnailCarousel;
