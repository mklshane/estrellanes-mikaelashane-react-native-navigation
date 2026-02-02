import React, { useEffect } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

interface SuccessModalProps {
  visible: boolean;
  message?: string;
  onDismiss?: () => void;
  duration?: number;
  colors: any;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  message = "Order Placed Successfully!",
  onDismiss,
  duration = 3000,
  colors,
}) => {
  useEffect(() => {
    if (visible && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss, duration]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <View style={styles.iconWrapper}>
            <Text style={styles.icon}>✓</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            {message}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>
            Thank you for your purchase
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 40,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default SuccessModal;
