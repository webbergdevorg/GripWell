/**
 * Gripwell - Owner Settings: Manage Products & Master SKU Catalog
 * Implementation of Google Stitch Screen 7 (5f8452ef383a4b69b6ef73cf3549d3a4).
 *
 * Supports Mobile and Desktop adaptive layouts with:
 * - Master SKU product catalog with category filter chips
 * - Collapsible Quick Add Drawer (#quickAddDrawer)
 * - Base rate editing & quick stock adjustment
 * - CSV catalog export
 * - Complete responsive navigation with Console Dashboard & Role Switcher
 */

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  TextInput as RNTextInput,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProductItemCard } from "../../components/domain/ProductItemCard";
import { QuickAddProductDrawer } from "../../components/domain/QuickAddProductDrawer";
import { RoleSwitcherPills } from "../../components/navigation/RoleSwitcherPills";
import { Text } from "../../components/ui/Text";
import { COLORS } from "../../constants/colors";
import {
  INITIAL_PRODUCT_KPIS,
  INITIAL_PRODUCTS,
  PRODUCT_CATEGORIES,
} from "../../constants/mockProducts";
import { RADIUS, SPACING } from "../../constants/spacing";
import { useResponsive } from "../../hooks/useResponsive";
import { useRoleContext } from "../../hooks/useRoleContext";
import { ProductSKU } from "../../types/models";

export default function ManageProductsScreen() {
  const insets = useSafeAreaInsets();
  const { isDesktop, width } = useResponsive();
  const { staff, terminalHub } = useRoleContext();

  const [products, setProducts] = useState<ProductSKU[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All (14)");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Category Filter
      if (selectedCategory !== "All (14)") {
        if (selectedCategory === "Furniture & Seating") {
          if (
            !item.category.includes("Furniture") &&
            !item.categoryTag.includes("Seating")
          ) {
            return false;
          }
        } else if (selectedCategory === "Industrial Crates") {
          if (
            !item.category.includes("Industrial") &&
            !item.categoryTag.includes("Industrial")
          ) {
            return false;
          }
        } else if (selectedCategory === "Packaging") {
          if (
            !item.category.includes("Packaging") &&
            !item.categoryTag.includes("Packaging")
          ) {
            return false;
          }
        } else if (selectedCategory === "Oils & Agro") {
          if (
            !item.category.includes("Agro") &&
            !item.category.includes("Oils")
          ) {
            return false;
          }
        }
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSku = item.sku.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        const matchesTag = item.categoryTag.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesCat && !matchesTag) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Handlers
  const handleAddNewProduct = (newProduct: ProductSKU) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(
      `SKU ${newProduct.sku} (${newProduct.name}) added to Master Catalog`,
    );
  };

  const handleUpdateRate = (productId: string, newRate: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const unit = p.unitMetric === "pcs" ? "pc" : p.unitMetric;
          return {
            ...p,
            defaultBaseRate: newRate,
            rateDisplay: `₹${newRate.toFixed(2)} / ${unit}`,
          };
        }
        return p;
      }),
    );
    showToast(`Updated rate for ${productId} to ₹${newRate.toFixed(2)}`);
  };

  const handleQuickAdjustStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.warehouseStock + delta);
          const isLow = newStock <= 100;
          return {
            ...p,
            warehouseStock: newStock,
            warehouseStockDisplay: `${newStock} ${p.unitMetric}`,
            isLowStock: isLow,
            status: isLow ? "LOW STOCK" : "ACTIVE",
          };
        }
        return p;
      }),
    );
  };

  const handleExportCSV = () => {
    const csvHeader =
      "SKU,Product Name,Category,Base Rate (INR),Unit,Stock,HSN\n";
    const csvRows = products
      .map(
        (p) =>
          `"${p.sku}","${p.name}","${p.category}",${p.defaultBaseRate},"${p.unitMetric}",${p.warehouseStock},"${p.hsnCode}"`,
      )
      .join("\n");
    const fullCsv = csvHeader + csvRows;

    if (Platform.OS === "web") {
      const blob = new Blob([fullCsv], { type: "text/csv;charset=utf-8;" });
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // -------------------------------------------------------------
  // DESKTOP VIEW
  // -------------------------------------------------------------
  if (isDesktop) {
    return (
      <View style={styles.desktopContainer}>
        {/* Desktop Sticky Header */}
        <View style={styles.desktopTopHeader}>
          <View style={styles.desktopHeaderLeft}>
            <View style={styles.brandIcon}>
              <MaterialIcons name="local-shipping" size={16} color="#FFFFFF" />
            </View>
            <Text variant="labelMd" style={styles.brandTitle}>
              GripWell
            </Text>
            <View style={styles.headerDivider} />
            {/* Breadcrumb */}
            <View style={styles.desktopBreadcrumb}>
              <Pressable
                onPress={() => router.replace("/(owner)/dashboard")}
                style={({ pressed }: any) => [
                  styles.breadcrumbLink,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  variant="labelSm"
                  color={COLORS.textMuted}
                  style={styles.breadcrumbText}
                >
                  CONSOLE
                </Text>
              </Pressable>
              <MaterialIcons
                name="chevron-right"
                size={14}
                color={COLORS.textMuted}
              />
              <Text
                variant="labelSm"
                color={COLORS.secondary}
                style={styles.breadcrumbActive}
              >
                PRODUCT CATALOG
              </Text>
            </View>
          </View>

          {/* Role Switcher Center */}
          <View style={styles.desktopRoleCenter}>
            <RoleSwitcherPills compact />
          </View>

          {/* Desktop Right */}
          <View style={styles.desktopHeaderRight}>
            <Pressable
              onPress={() => router.replace("/(owner)/dashboard")}
              style={({ pressed }: any) => [
                styles.consoleSwitchBtn,
                pressed && styles.pressed,
              ]}
            >
              <MaterialIcons
                name="dashboard"
                size={15}
                color={COLORS.textPrimary}
              />
              <Text variant="labelSm" style={{ fontWeight: "600" }}>
                Console Dashboard
              </Text>
            </Pressable>

            <View style={styles.headerDivider} />

            <View style={styles.hubIndicator}>
              <View style={styles.hubDot} />
              <Text variant="bodySm" color={COLORS.textSecondary}>
                {terminalHub}
              </Text>
            </View>

            <View style={styles.profileBadge}>
              <Text variant="labelSm" style={styles.profileInitials}>
                {staff.initials}
              </Text>
            </View>
          </View>
        </View>

        {/* Desktop Content Area */}
        <ScrollView
          style={styles.desktopScroll}
          contentContainerStyle={styles.desktopScrollContent}
        >
          <View style={styles.desktopMaxContainer}>
            {/* Toast Banner */}
            {toastMessage && (
              <View style={styles.toastBanner}>
                <MaterialIcons name="check-circle" size={16} color="#059669" />
                <Text variant="bodySm" style={styles.toastText}>
                  {toastMessage}
                </Text>
              </View>
            )}

            {/* Breadcrumb & Subtitle Strip */}
            <View style={styles.desktopTitleSection}>
              <View>
                <View style={styles.desktopBreadcrumbSmall}>
                  <Text variant="labelSm" style={styles.breadcrumbSmallText}>
                    SETTINGS
                  </Text>
                  <MaterialIcons
                    name="chevron-right"
                    size={14}
                    color={COLORS.textMuted}
                  />
                  <Text variant="labelSm" style={styles.breadcrumbSmallActive}>
                    PRODUCT CATALOG
                  </Text>
                </View>
                <Text variant="headlineXl" style={styles.desktopMainHeading}>
                  Manage Products
                </Text>
                <Text variant="bodyMd" color={COLORS.textSecondary}>
                  Master item catalog, default unit pricing & inventory state
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.desktopActionRow}>
                <Pressable
                  onPress={() => setIsDrawerOpen(!isDrawerOpen)}
                  style={({ pressed }: any) => [
                    styles.primaryAddBtn,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                >
                  <MaterialIcons name="add" size={18} color="#FFFFFF" />
                  <Text variant="labelMd" style={styles.primaryAddBtnText}>
                    {isDrawerOpen ? "Close Form" : "Add Product"}
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
                    size={17}
                    color={COLORS.textPrimary}
                  />
                  <Text variant="labelMd" style={styles.exportBtnText}>
                    Export CSV
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Collapsible Quick Add Drawer */}
            <QuickAddProductDrawer
              visible={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              onSaveProduct={handleAddNewProduct}
              isDesktop={true}
            />

            {/* 3 KPI Summary Cards */}
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text variant="labelSm" color={COLORS.textSecondary}>
                  Total SKUs
                </Text>
                <View style={styles.kpiValueRow}>
                  <Text variant="headlineMd" style={styles.kpiValue}>
                    {products.length}
                  </Text>
                  <Text variant="labelSm" style={styles.kpiLiveBadge}>
                    {INITIAL_PRODUCT_KPIS.totalSkusTag}
                  </Text>
                </View>
              </View>

              <View style={styles.kpiCard}>
                <Text variant="labelSm" color={COLORS.textSecondary}>
                  Rate Updates
                </Text>
                <View style={styles.kpiValueRow}>
                  <Text variant="headlineMd" style={styles.kpiValue}>
                    {INITIAL_PRODUCT_KPIS.rateUpdates}
                  </Text>
                  <Text
                    variant="labelSm"
                    color={COLORS.textSecondary}
                    style={styles.kpiTodayBadge}
                  >
                    {INITIAL_PRODUCT_KPIS.rateUpdatesTag}
                  </Text>
                </View>
              </View>

              <View style={styles.kpiCard}>
                <Text variant="labelSm" color={COLORS.textSecondary}>
                  Avg Margin
                </Text>
                <View style={styles.kpiValueRow}>
                  <Text
                    variant="headlineMd"
                    style={[styles.kpiValue, { color: COLORS.secondary }]}
                  >
                    {INITIAL_PRODUCT_KPIS.avgMargin}
                  </Text>
                </View>
              </View>
            </View>

            {/* Search and Category Filter Section */}
            <View style={styles.filterSection}>
              {/* Search Box */}
              <View style={styles.searchBox}>
                <MaterialIcons
                  name="search"
                  size={18}
                  color={COLORS.textMuted}
                />
                <RNTextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search product title, SKU, category..."
                  placeholderTextColor={COLORS.textMuted}
                  style={styles.searchInput}
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery("")}>
                    <MaterialIcons
                      name="close"
                      size={16}
                      color={COLORS.textMuted}
                    />
                  </Pressable>
                )}
              </View>

              {/* Horizontal Category Chips */}
              <View style={styles.categoryChipsRow}>
                {PRODUCT_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setSelectedCategory(cat)}
                      style={[
                        styles.chipBtn,
                        isActive
                          ? styles.chipBtnActive
                          : styles.chipBtnInactive,
                      ]}
                    >
                      <Text
                        variant="labelSm"
                        style={[
                          styles.chipText,
                          isActive
                            ? styles.chipTextActive
                            : styles.chipTextInactive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Product Card Grid */}
            <View style={styles.desktopProductGrid}>
              {filteredProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <MaterialIcons
                    name="search-off"
                    size={36}
                    color={COLORS.textMuted}
                  />
                  <Text variant="headlineSm" style={styles.emptyTitle}>
                    No Matching SKUs Found
                  </Text>
                  <Text
                    variant="bodyMd"
                    color={COLORS.textSecondary}
                    style={styles.emptySubtitle}
                  >
                    Try searching for another product name or SKU, or click Add
                    Product to create one.
                  </Text>
                </View>
              ) : (
                filteredProducts.map((prod) => (
                  <View key={prod.id} style={styles.desktopGridItem}>
                    <ProductItemCard
                      product={prod}
                      onUpdateRate={handleUpdateRate}
                      onQuickAdjustStock={handleQuickAdjustStock}
                      isDesktop={true}
                    />
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // -------------------------------------------------------------
  // MOBILE VIEW (Exact Match to Stitch Screen 7: 5f8452ef383a4b69b6ef73cf3549d3a4)
  // -------------------------------------------------------------
  return (
    <View style={styles.mobileContainer}>
      {/* Fixed Top Safe Header (Stitch #header) */}
      <View
        style={[styles.mobileTopBar, { paddingTop: Math.max(insets.top, 10) }]}
      >
        {/* Top Role Switcher Row for Quick Multi-Role Hop */}
        <View style={styles.mobileRoleRow}>
          <RoleSwitcherPills compact />
        </View>

        {/* Main Header Row */}
        <View style={styles.mobileHeaderRow}>
          <View style={styles.mobileHeaderLeft}>
            <MaterialIcons name="shield" size={20} color={COLORS.primary} />
            <Text variant="headlineMd" style={styles.mobileHeaderTitle}>
              Settings
            </Text>
          </View>

          <View style={styles.mobileHeaderRight}>
            <Pressable
              style={({ pressed }: any) => [
                styles.mobileHeaderIconBtn,
                pressed && styles.pressed,
              ]}
              accessibilityLabel="Notifications"
            >
              <MaterialIcons
                name="notifications"
                size={20}
                color={COLORS.textSecondary}
              />
            </Pressable>
            <View style={styles.mobileAvatar}>
              <MaterialIcons name="person" size={17} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.mobileScroll}
        contentContainerStyle={[
          styles.mobileScrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 64 },
        ]}
      >
        {/* Toast Alert */}
        {toastMessage && (
          <View style={styles.toastBanner}>
            <MaterialIcons name="check-circle" size={16} color="#059669" />
            <Text variant="bodySm" style={styles.toastText}>
              {toastMessage}
            </Text>
          </View>
        )}

        {/* Breadcrumb & Subtitle Section */}
        <View style={styles.mobileBreadcrumbSection}>
          <View style={styles.mobileBreadcrumbRow}>
            <Text variant="labelSm" style={styles.mobileBreadcrumbMuted}>
              SETTINGS
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={13}
              color={COLORS.textMuted}
            />
            <Text variant="labelSm" style={styles.mobileBreadcrumbActive}>
              PRODUCT CATALOG
            </Text>
          </View>

          <View style={styles.mobileHeadingBlock}>
            <Text variant="headlineLgMobile" style={styles.mobileMainHeading}>
              Manage Products
            </Text>
            <Text
              variant="bodySm"
              color={COLORS.textSecondary}
              style={styles.mobileSubheading}
            >
              Master item catalog, default unit pricing & inventory state
            </Text>
          </View>

          {/* Quick Action Triggers */}
          <View style={styles.mobileActionButtonsRow}>
            <Pressable
              onPress={() => setIsDrawerOpen(!isDrawerOpen)}
              style={({ pressed }: any) => [
                styles.mobileAddProductBtn,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
            >
              <MaterialIcons name="add" size={18} color="#FFFFFF" />
              <Text variant="labelMd" style={styles.mobileAddBtnText}>
                {isDrawerOpen ? "Close Entry" : "Add Product"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleExportCSV}
              style={({ pressed }: any) => [
                styles.mobileExportBtn,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
            >
              <MaterialIcons
                name="ios-share"
                size={17}
                color={COLORS.textPrimary}
              />
              <Text variant="labelMd" style={styles.mobileExportBtnText}>
                Export CSV
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Collapsible Quick Add Product Drawer */}
        <QuickAddProductDrawer
          visible={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSaveProduct={handleAddNewProduct}
        />

        {/* Minimal KPI Summary Row (3 Columns) */}
        <View style={styles.mobileKpiGrid}>
          <View style={styles.mobileKpiCard}>
            <Text variant="labelSm" color={COLORS.textSecondary}>
              Total SKUs
            </Text>
            <View style={styles.mobileKpiValueRow}>
              <Text variant="headlineMd" style={styles.mobileKpiValue}>
                {products.length}
              </Text>
              <Text variant="labelSm" style={styles.mobileKpiLiveText}>
                {INITIAL_PRODUCT_KPIS.totalSkusTag}
              </Text>
            </View>
          </View>

          <View style={styles.mobileKpiCard}>
            <Text variant="labelSm" color={COLORS.textSecondary}>
              Rate Updates
            </Text>
            <View style={styles.mobileKpiValueRow}>
              <Text variant="headlineMd" style={styles.mobileKpiValue}>
                {INITIAL_PRODUCT_KPIS.rateUpdates}
              </Text>
              <Text
                variant="labelSm"
                color={COLORS.textSecondary}
                style={styles.mobileKpiTodayText}
              >
                {INITIAL_PRODUCT_KPIS.rateUpdatesTag}
              </Text>
            </View>
          </View>

          <View style={styles.mobileKpiCard}>
            <Text variant="labelSm" color={COLORS.textSecondary}>
              Avg Margin
            </Text>
            <View style={styles.mobileKpiValueRow}>
              <Text
                variant="headlineMd"
                style={[styles.mobileKpiValue, { color: COLORS.secondary }]}
              >
                {INITIAL_PRODUCT_KPIS.avgMargin}
              </Text>
            </View>
          </View>
        </View>

        {/* Search & Segment Filters */}
        <View style={styles.mobileSearchSection}>
          <View style={styles.mobileSearchInputWrapper}>
            <MaterialIcons
              name="search"
              size={18}
              color={COLORS.textMuted}
              style={{ marginRight: 8 }}
            />
            <RNTextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search product title, SKU, category..."
              placeholderTextColor={COLORS.textMuted}
              style={styles.mobileSearchInputField}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <MaterialIcons
                  name="close"
                  size={16}
                  color={COLORS.textMuted}
                />
              </Pressable>
            )}
          </View>

          {/* Scrollable Horizontal Chip Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mobileChipsScroll}
          >
            {PRODUCT_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.mobileChip,
                    isActive
                      ? styles.mobileChipActive
                      : styles.mobileChipInactive,
                  ]}
                >
                  <Text
                    variant="labelSm"
                    style={[
                      styles.mobileChipText,
                      isActive
                        ? styles.mobileChipTextActive
                        : styles.mobileChipTextInactive,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Product Inventory & Rates Card Stack */}
        <View style={styles.mobileCardStack}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons
                name="search-off"
                size={32}
                color={COLORS.textMuted}
              />
              <Text variant="headlineSm" style={styles.emptyTitle}>
                No Matching Products
              </Text>
              <Text
                variant="bodySm"
                color={COLORS.textSecondary}
                style={styles.emptySubtitle}
              >
                No SKUs matched "{searchQuery}".
              </Text>
            </View>
          ) : (
            filteredProducts.map((prod) => (
              <ProductItemCard
                key={prod.id}
                product={prod}
                onUpdateRate={handleUpdateRate}
                onQuickAdjustStock={handleQuickAdjustStock}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Safe Navigation Bar (Stitch Nav) */}
      <View
        style={[
          styles.mobileBottomNav,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <View style={styles.bottomNavRow}>
          {/* Console Tab (Inactive) */}
          <Pressable
            onPress={() => router.replace("/(owner)/dashboard")}
            style={({ pressed }: any) => [
              styles.bottomNavItem,
              pressed && styles.pressed,
            ]}
            accessibilityRole="tab"
          >
            <MaterialIcons name="terminal" size={22} color={COLORS.textMuted} />
            <Text
              variant="labelSm"
              color={COLORS.textMuted}
              style={styles.bottomNavText}
            >
              Console
            </Text>
          </Pressable>

          {/* Settings Tab (Active) */}
          <Pressable
            style={styles.bottomNavItem}
            accessibilityRole="tab"
            accessibilityState={{ selected: true }}
          >
            <MaterialIcons name="tune" size={22} color={COLORS.textPrimary} />
            <Text
              variant="labelSm"
              color={COLORS.textPrimary}
              style={[styles.bottomNavText, styles.bottomNavTextActive]}
            >
              Settings
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // -------------------------------------------------------------
  // DESKTOP STYLES
  // -------------------------------------------------------------
  desktopContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  desktopTopHeader: {
    height: SPACING.headerHeight,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.spaceXl,
  },
  desktopHeaderLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm + 2,
  },
  brandIcon: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  headerDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  desktopBreadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  breadcrumbLink: {
    paddingVertical: 2,
  },
  breadcrumbText: {
    letterSpacing: 0.5,
    fontWeight: "500",
  },
  breadcrumbActive: {
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  desktopRoleCenter: {
    width: 320,
    marginHorizontal: SPACING.spaceBase,
    alignItems: "center",
    justifyContent: "center",
  },
  desktopHeaderRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: SPACING.spaceSm + 4,
  },
  consoleSwitchBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  hubIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  hubDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  profileBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitials: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  desktopScroll: {
    flex: 1,
  },
  desktopScrollContent: {
    paddingVertical: SPACING.spaceXl,
    paddingHorizontal: SPACING.spaceXl,
    alignItems: "center",
  },
  desktopMaxContainer: {
    width: "100%",
    maxWidth: 1200,
  },
  desktopTitleSection: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: SPACING.spaceLg,
  },
  desktopBreadcrumbSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  breadcrumbSmallText: {
    letterSpacing: 0.5,
    color: COLORS.textMuted,
  },
  breadcrumbSmallActive: {
    letterSpacing: 0.5,
    color: COLORS.secondary,
    fontWeight: "600",
  },
  desktopMainHeading: {
    letterSpacing: -0.5,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  desktopActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
  },
  primaryAddBtn: {
    height: 36,
    paddingHorizontal: SPACING.spaceBase,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  primaryAddBtnText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  exportBtn: {
    height: 36,
    paddingHorizontal: SPACING.spaceBase,
    borderRadius: RADIUS.sm,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  exportBtnText: {
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  kpiRow: {
    flexDirection: "row",
    gap: SPACING.spaceSm + 2,
    marginBottom: SPACING.spaceLg,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.spaceBase,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      web: { boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
    }),
  },
  kpiValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 6,
  },
  kpiValue: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  kpiLiveBadge: {
    color: "#059669",
    fontWeight: "600",
  },
  kpiTodayBadge: {
    fontSize: 11,
  },
  filterSection: {
    marginBottom: SPACING.spaceLg,
    gap: SPACING.spaceSm,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.spaceSm + 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    padding: 0,
    marginLeft: 8,
    ...Platform.select({
      web: { outlineStyle: "none" as any },
    }),
  },
  categoryChipsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceXs + 2,
  },
  chipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  chipBtnActive: {
    backgroundColor: COLORS.primary,
  },
  chipBtnInactive: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  chipTextInactive: {
    color: COLORS.textSecondary,
  },
  desktopProductGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -SPACING.spaceXs,
  },
  desktopGridItem: {
    width: "50%",
    paddingHorizontal: SPACING.spaceXs,
  },

  // -------------------------------------------------------------
  // MOBILE STYLES (Exact Stitch Screen 7)
  // -------------------------------------------------------------
  mobileContainer: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  mobileTopBar: {
    backgroundColor: "rgba(248, 249, 255, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    paddingHorizontal: SPACING.spaceBase,
    paddingBottom: SPACING.spaceXs + 2,
    zIndex: 10,
    ...Platform.select({
      web: {
        position: "sticky" as any,
        top: 0,
        backdropFilter: "blur(16px)",
      },
    }),
  },
  mobileRoleRow: {
    alignItems: "center",
    marginBottom: 6,
  },
  mobileHeaderRow: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mobileHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mobileHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  mobileHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mobileHeaderIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileScroll: {
    flex: 1,
  },
  mobileScrollContent: {
    paddingHorizontal: SPACING.spaceBase,
    paddingTop: SPACING.spaceSm + 2,
  },
  mobileBreadcrumbSection: {
    marginBottom: SPACING.spaceBase,
  },
  mobileBreadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  mobileBreadcrumbMuted: {
    fontSize: 11,
    letterSpacing: 0.5,
    color: COLORS.textMuted,
  },
  mobileBreadcrumbActive: {
    fontSize: 11,
    letterSpacing: 0.5,
    color: COLORS.secondary,
    fontWeight: "600",
  },
  mobileHeadingBlock: {
    marginTop: 2,
  },
  mobileMainHeading: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  mobileSubheading: {
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  mobileActionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.spaceSm,
    marginTop: SPACING.spaceSm + 2,
  },
  mobileAddProductBtn: {
    flex: 1,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...Platform.select({
      web: { cursor: "pointer" },
      default: { elevation: 1 },
    }),
  },
  mobileAddBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  mobileExportBtn: {
    height: 36,
    paddingHorizontal: SPACING.spaceBase,
    borderRadius: RADIUS.md,
    backgroundColor: "#EFF4FF",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  mobileExportBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  mobileKpiGrid: {
    flexDirection: "row",
    gap: SPACING.spaceXs + 2,
    marginBottom: SPACING.spaceBase,
  },
  mobileKpiCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: SPACING.spaceSm + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    ...Platform.select({
      web: { boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
      default: { elevation: 1 },
    }),
  },
  mobileKpiValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginTop: 4,
  },
  mobileKpiValue: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  mobileKpiLiveText: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },
  mobileKpiTodayText: {
    fontSize: 11,
  },
  mobileSearchSection: {
    marginBottom: SPACING.spaceBase,
    gap: SPACING.spaceXs + 2,
  },
  mobileSearchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.spaceSm + 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    ...Platform.select({
      web: { boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
      default: { elevation: 1 },
    }),
  },
  mobileSearchInputField: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    padding: 0,
    ...Platform.select({
      web: { outlineStyle: "none" as any },
    }),
  },
  mobileChipsScroll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 2,
  },
  mobileChip: {
    height: 28,
    paddingHorizontal: 12,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileChipActive: {
    backgroundColor: COLORS.primary,
  },
  mobileChipInactive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  mobileChipText: {
    fontSize: 11,
  },
  mobileChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  mobileChipTextInactive: {
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  mobileCardStack: {
    gap: 2,
  },
  mobileBottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
    paddingTop: 8,
    ...Platform.select({
      web: {
        backdropFilter: "blur(16px)",
      },
    }),
  },
  bottomNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  bottomNavItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
    minHeight: 44,
    paddingVertical: 2,
  },
  bottomNavText: {
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  bottomNavTextActive: {
    fontWeight: "600",
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
    maxWidth: 280,
  },
  toastBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: SPACING.spaceSm + 2,
  },
  toastText: {
    color: "#065F46",
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.8,
  },
});
