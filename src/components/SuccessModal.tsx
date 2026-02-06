import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ThemeColors } from "../styles/colors";

interface SuccessModalProps {
  visible: boolean;
  message?: string;
  onConfirm?: () => void;
  colors: ThemeColors;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  message = "Order Placed Successfully!",
  onConfirm,
  colors,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onConfirm}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <View style={[styles.iconWrapper, { backgroundColor: colors.ctaPeach }]}>
            <Text style={styles.icon}>✓</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            {message}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedText }]}>
            Thank you for your purchase
          </Text>
          <Pressable
            onPress={onConfirm}
            style={[
              styles.okButton,
              { backgroundColor: colors.ctaPeach },
            ]}
          >
            <Text style={[styles.okButtonText, { color: "#000000" }]}>
              OK
            </Text>
          </Pressable>
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
    backgroundColor: "#81D14F",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 40,
    color: "#000000",
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
  okButton: {
    marginTop: 6,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  okButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});

export default SuccessModal;
