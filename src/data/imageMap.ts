// Map string asset paths from products.json to static requires so Metro can bundle them.
const imageMap: Record<string, any> = {
  "../assets/products/p1/p1-1.png": require("../../assets/products/p1/p1-1.png"),
  "../assets/products/p1/p1-2.png": require("../../assets/products/p1/p1-2.png"),
  "../assets/products/p1/p1-3.png": require("../../assets/products/p1/p1-3.png"),
  "../assets/products/p2/p2-1.png": require("../../assets/products/p2/p2-1.png"),
  "../assets/products/p2/p2-2.png": require("../../assets/products/p2/p2-2.png"),
  "../assets/products/p2/p2-3.png": require("../../assets/products/p2/p2-3.png"),
  "../assets/products/p3/p3-1.png": require("../../assets/products/p3/p3-1.png"),
  "../assets/products/p3/p3-2.png": require("../../assets/products/p3/p3-2.png"),
  "../assets/products/p3/p3-3.png": require("../../assets/products/p3/p3-3.png"),
  "../assets/products/p4/p4-1.png": require("../../assets/products/p4/p4-1.png"),
  "../assets/products/p4/p4-2.png": require("../../assets/products/p4/p4-2.png"),
  "../assets/products/p4/p4-3.png": require("../../assets/products/p4/p4-3.png"),
  "../assets/products/p5/p5-1.png": require("../../assets/products/p5/p5-1.png"),
  "../assets/products/p5/p5-2.png": require("../../assets/products/p5/p5-2.png"),
  "../assets/products/p5/p5-3.png": require("../../assets/products/p5/p5-3.png"),
  "../assets/products/p6/p6-1.png": require("../../assets/products/p6/p6-1.png"),
  "../assets/products/p6/p6-2.png": require("../../assets/products/p6/p6-2.png"),
  "../assets/products/p6/p6-3.png": require("../../assets/products/p6/p6-3.png"),
  "../assets/products/p7/p7-1.png": require("../../assets/products/p7/p7-1.png"),
  "../assets/products/p7/p7-2.png": require("../../assets/products/p7/p7-2.png"),
  "../assets/products/p7/p7-3.png": require("../../assets/products/p7/p7-3.png"),
  "../assets/products/p8/p8-1.png": require("../../assets/products/p8/p8-1.png"),
  "../assets/products/p8/p8-2.png": require("../../assets/products/p8/p8-2.png"),
  "../assets/products/p8/p8-3.png": require("../../assets/products/p8/p8-3.png"),
  "../assets/products/p9/p9-1.png": require("../../assets/products/p9/p9-1.png"),
  "../assets/products/p9/p9-2.png": require("../../assets/products/p9/p9-2.png"),
  "../assets/products/p9/p9-3.png": require("../../assets/products/p9/p9-3.png"),
  "../assets/products/p10/p10-1.png": require("../../assets/products/p10/p10-1.png"),
  "../assets/products/p10/p10-2.png": require("../../assets/products/p10/p10-2.png"),
  "../assets/products/p10/p10-3.png": require("../../assets/products/p10/p10-3.png"),
};

export const resolveImageSource = (source?: string) => {
  if (!source) return null;
  if (source.startsWith("http")) return { uri: source };
  return imageMap[source] ?? null;
};

export default imageMap;
