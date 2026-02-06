import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontWeight: "800",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  emptySubtitle: {
    fontWeight: "500",
    textAlign: "center",
  },
  bottomBar: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 12,
  },
  checkoutBtn: {
    paddingVertical: 14,
    alignItems: "center",
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
