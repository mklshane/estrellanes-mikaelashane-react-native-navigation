import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { styles } from "../../screens/Home/Home.styles";

type EmptyStateProps = {
  title?: string;
  subtitle?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No matches found",
  subtitle = "Try a different keyword.",
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.emptySubtitle, { color: colors.mutedText }]}>
        {subtitle}
      </Text>
    </View>
  );
};

export default EmptyState;
