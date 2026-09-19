/**
 * Gripwell - Owner: Products Mobile Embed
 * Self-contained mobile product catalog for inline rendering inside the Owner tab shell.
 * Extracted from app/(owner)/products.tsx mobile view.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { COLORS } from "../../constants/colors";
import {
  INITIAL_PRODUCT_KPIS,
  INITIAL_PRODUCTS,
  PRODUCT_CATEGORIES,
} from "../../constants/mockProducts";
import { RADIUS, SPACING } from "../../constants/spacing";
import { ProductSKU } from "../../types/models";
import { Text } from "../ui/Text";
import { ProductItemCard } from "./ProductItemCard";
import { QuickAddProductDrawer } from "./QuickAddProductDrawer";

export const OwnerProductsMobileEmbed: React.FC = () => {
  const [products, setProducts] = useState<ProductSKU[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All (14)");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (selectedCategory !== "All (14)") {
        if (selectedCategory === "Furniture & Seating") {
          if (
            !item.category.includes("Furniture") &&
            !item.categoryTag.includes("Seating")
          )
            return false;
        } else if (selectedCategory === "Industrial Crates") {
          if (
            !item.category.includes("Industrial") &&
            !item.categoryTag.includes("Industrial")
          )
            return false;
        } else if (selectedCategory === "Packaging") {
          if (
            !item.category.includes("Packaging") &&
            !item.categoryTag.includes("Packaging")
          )
            return false;
        } else if (selectedCategory === "Oils & Agro") {
          if (
            !item.category.includes("Agro") &&
            !item.category.includes("Oils")
          )
            return false;
        }
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        if (
          !item.name.toLowerCase().includes(query) &&
          !item.sku.toLowerCase().includes(query) &&
          !item.category.toLowerCase().includes(query) &&
          !item.categoryTag.toLowerCase().includes(query)
        )
          return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddNewProduct = (newProduct: ProductSKU) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`SKU ${newProduct.sku} (${newProduct.name}) added to catalog`);
  };

  const handleUpdateRate = (
    productId: string,
    newRate: number,
    newDefaultPlus?: number,
    newMinThreshold?: number,
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const unit = p.unitMetric === "pcs" ? "pc" : p.unitMetric;
          const defaultPlus =
            newDefaultPlus ?? (p.defaultPlusRate || Math.round(newRate * 1.12));
          const minThreshold =
            newMinThreshold ??
            (p.minThresholdRate || Math.round(newRate * 0.9));
          return {
            ...p,
            defaultBaseRate: newRate,
            defaultPlusRate: defaultPlus,
            minThresholdRate: minThreshold,
            rateDisplay: `₹${newRate.toFixed(2)} / ${unit}`,
          };
        }
        return p;
      }),
    );
    showToast(`Updated pricing for ${productId}`);
  };

  const handleExportCSV = () => {
    if (Platform.OS === "web") {
      const csvHeader =
        "SKU,Product Name,Category,Default Price (INR),Default+ Price (INR),Min Threshold Price (INR),Unit,HSN\n";
      const csvRows = products
        .map(
          (p) =>
            `"${p.sku}","${p.name}","${p.category}",${p.defaultBaseRate},${p.defaultPlusRate ?? Math.round(p.defaultBaseRate * 1.12)},${p.minThresholdRate ?? Math.round(p.defaultBaseRate * 0.9)},"${p.unitMetric}","${p.hsnCode}"`,
        )
        .join("\n");
      const blob = new Blob([csvHeader + csvRows], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "GripWell_Master_Products_Catalog.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Downloaded GripWell_Master_Products_Catalog.csv");
    } else {
      Alert.alert(
        "Export CSV",
        `Catalog containing ${products.length} Master SKUs ready for download.`,
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Toast */}
      {toastMessage && (
        <View style={styles.toast}>
          <MaterialIcons
            name="check-circle"
            size={14}
            color={COLORS.statusPaidText}
          />
          <Text variant="bodySm" style={styles.toastText}>
            {toastMessage}
          </Text>
        </View>
      )}

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <MaterialIcons name="inventory-2" size={18} color={COLORS.primary} />
          <Text variant="headlineSm" style={styles.sectionTitle}>
            Product Catalog
          </Text>
        </View>
        <Text
          variant="bodySm"
          color={COLORS.textSecondary}
          style={styles.sectionSub}
        >
          Master SKUs, unit pricing & inventory
        </Text>
      </View>

      {/* Action Row */}
      <View style={styles.actionRow}>
        <Pressable
          onPress={() => setIsDrawerOpen(!isDrawerOpen)}
          style={({ pressed }: any) => [
            styles.addBtn,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
        >
          <MaterialIcons name="add" size={16} color="#FFFFFF" />
          <Text variant="labelSm" style={styles.addBtnText}>
            {isDrawerOpen ? "Close Entry" : "Add Product"}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleExportCSV}
          style={({ pressed }: any) => [
            styles.exportBtn,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
        >
          <MaterialIcons
            name="ios-share"
            size={15}
            color={COLORS.textPrimary}
          />
          <Text variant="labelSm" style={styles.exportBtnText}>
            Export CSV
          </Text>
        </Pressable>
      </View>

      {/* Quick Add Drawer */}
      <QuickAddProductDrawer
        visible={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSaveProduct={handleAddNewProduct}
      />

      {/* KPI Strip */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text variant="labelSm" color={COLORS.textSecondary}>
            Total SKUs
          </Text>
          <Text variant="headlineSm" style={styles.kpiVal}>
            {products.length}
          </Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiCard}>
          <Text variant="labelSm" color={COLORS.textSecondary}>
            Rate Updates
          </Text>
          <Text variant="headlineSm" style={styles.kpiVal}>
            {INITIAL_PRODUCT_KPIS.rateUpdates}
          </Text>
        </View>
        <View style={styles.kpiDivider} />
        <View style={styles.kpiCard}>
          <Text variant="labelSm" color={COLORS.textSecondary}>
            Avg Margin
          </Text>
          <Text
            variant="headlineSm"
            style={[styles.kpiVal, { color: COLORS.secondary }]}
          >
            {INITIAL_PRODUCT_KPIS.avgMargin}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <MaterialIcons
          name="search"
          size={16}
          color={COLORS.textMuted}
          style={{ marginRight: 6 }}
        />
        <RNTextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search product, SKU, category..."
          placeholderTextColor={COLORS.textMuted}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <MaterialIcons name="close" size={15} color={COLORS.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {PRODUCT_CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.chip,
                active ? styles.chipActive : styles.chipInactive,
              ]}
            >
              <Text
                variant="labelSm"
                style={[
                  styles.chipText,
                  active ? styles.chipTextActive : styles.chipTextInactive,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="search-off" size={28} color={COLORS.textMuted} />
          <Text variant="headlineSm" style={styles.emptyTitle}>
            No Matching Products
          </Text>
          <Text variant="bodySm" color={COLORS.textSecondary}>
            No SKUs matched &ldquo;{searchQuery}&rdquo;
          </Text>
        </View>
      ) : (
        <View style={styles.cardStack}>
          {filteredProducts.map((prod) => (
            <ProductItemCard
              key={prod.id}
              product={prod}
              onUpdateRate={handleUpdateRate}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.spaceMd,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: RADIUS.xs,
    padding: SPACING.spaceSm + 2,
  },
  toastText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  sectionSub: {
    fontSize: 12,
    marginLeft: 24,
  },
  actionRow: {
    flexDirection: "row",
    gap: SPACING.spaceSm,
  },
  addBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: 36,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
  },
  addBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: 36,
    paddingHorizontal: SPACING.spaceMd,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
  },
  exportBtnText: {
    fontWeight: "600",
    color: COLORS.textPrimary,
    fontSize: 12,
  },
  kpiRow: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    overflow: "hidden",
  },
  kpiCard: {
    flex: 1,
    padding: SPACING.spaceSm + 2,
    gap: 2,
  },
  kpiDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  kpiVal: {
    fontWeight: "700",
    color: COLORS.textPrimary,
    fontSize: 18,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 38,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.spaceSm + 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    padding: 0,
    ...Platform.select({ web: { outlineStyle: "none" as any } }),
  },
  chipsRow: {
    gap: SPACING.spaceSm,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: SPACING.spaceMd,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipInactive: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  chipTextInactive: {
    color: COLORS.textSecondary,
  },
  cardStack: {
    gap: SPACING.spaceSm,
  },
  empty: {
    alignItems: "center",
    paddingVertical: SPACING.space2xl,
    gap: SPACING.spaceSm,
  },
  emptyTitle: {
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  pressed: {
    opacity: 0.75,
  },
});
