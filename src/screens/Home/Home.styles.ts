import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  searchWrapper: {
    flex: 1,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  row: {
    gap: 14,
    paddingHorizontal: 12,
  },
  column: {
    flex: 1,
  },
  placeholderColumn: {
    opacity: 0,
  },
  listContent: {
    gap: 14,
    paddingBottom: 32,
    paddingTop: 10,
  },
  emptyState: {
    paddingTop: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
