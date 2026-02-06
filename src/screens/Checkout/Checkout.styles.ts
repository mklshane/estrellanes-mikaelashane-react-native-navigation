import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  itemGap: {
    height: 8,
  },
  footerSection: {
    marginTop: 16,
    gap: 12,
  },
  emptyContainer: {
    gap: 16,
  },
  emptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(15, 23, 42, 0.05)",
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
  },
  emptySubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  checkoutBtn: {
    borderRadius: 12,
  },
  cancelBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1.5,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
