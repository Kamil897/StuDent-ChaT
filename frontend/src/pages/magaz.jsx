import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../Context/UserContext";
import Shop from "../components/Shop/Shop";
import s from "./Magaz.module.scss";
import { PRODUCTS } from "../data/products";

const Magaz = () => {
  const { user, spendPoints } = useUser();
  const { t } = useTranslation();

  const [purchasedIds, setPurchasedIds] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const storedIds = JSON.parse(localStorage.getItem("purchasedItems") || "[]");
    setPurchasedIds(storedIds);
  }, []);

  useEffect(() => {
    localStorage.setItem("purchasedItems", JSON.stringify(purchasedIds));
  }, [purchasedIds]);

  const handleBuy = async (product) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    if (spendPoints(product.price)) {
      if (!purchasedIds.includes(product.id)) {
        setPurchasedIds((prev) => [...prev, product.id]);
      }
      showNotification(`✅ ${t(product.name)} ${t("shop.success")}`, "success");
    } else {
      showNotification(t("shop.insufficientFunds"), "error");
    }

    setIsLoading(false);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const affordableCount = PRODUCTS.filter((p) => user.points >= p.price).length;

  const filteredProducts = PRODUCTS
    .filter((product) => {
      if (filter === "affordable") return user.points >= product.price;
      if (filter === "unaffordable") return user.points < product.price;
      if (filter === "purchased") return purchasedIds.includes(product.id);
      return true;
    })
    .filter((product) => {
      if (!searchQuery) return true;
      return (
        (t(product.name) || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t(product.description) || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return t(a.name).localeCompare(t(b.name));
        case "rarity":
          const order = { common: 1, rare: 2, legendary: 3 };
          return order[b.rarity] - order[a.rarity];
        default:
          return 0;
      }
    });

  const getTotalValue = () => {
    return PRODUCTS.filter((p) => purchasedIds.includes(p.id)).reduce((sum, item) => sum + item.price, 0);
  };

  return (
    <div className={s.container}>
      {notification && (
        <div className={`${s.notification} ${s[notification.type]}`}>
          {notification.message}
        </div>
      )}

      <header className={s.header}>
        <div className={s.titleSection}>
          <h1 className={s.title}>{t("shop.title")}</h1>
          <p className={s.subtitle}>
            {t("shop.available", { count: affordableCount, total: PRODUCTS.length })}
          </p>
        </div>

        <div className={s.userInfo}>
          <div className={s.balance}>
            <span className={s.balanceLabel}>{t("shop.balance")}</span>
            <span className={s.balanceAmount}>{user.points.toLocaleString()}</span>
          </div>

          {purchasedIds.length > 0 && (
            <div className={s.purchaseInfo}>
              <span className={s.purchaseLabel}>{t("shop.spent")}</span>
              <span className={s.purchaseAmount}>{getTotalValue().toLocaleString()}</span>
            </div>
          )}
        </div>
      </header>

      <div className={s.controls}>
        <div className={s.searchSection}>
          <input
            type="text"
            placeholder={t("shop.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={s.searchInput}
          />
        </div>

        <div className={s.filtersSection}>
          <div className={s.filterGroup}>
            <label className={s.filterLabel}>{t("shop.filter")}</label>
            <div className={s.filters}>
              <button className={filter === "all" ? s.active : ""} onClick={() => setFilter("all")}>
                {t("shop.all", { count: PRODUCTS.length })}
              </button>
              <button className={filter === "affordable" ? s.active : ""} onClick={() => setFilter("affordable")}>
                {t("shop.affordable", { count: affordableCount })}
              </button>
              <button className={filter === "unaffordable" ? s.active : ""} onClick={() => setFilter("unaffordable")}>
                {t("shop.unaffordable", { count: PRODUCTS.length - affordableCount })}
              </button>
              <button className={filter === "purchased" ? s.active : ""} onClick={() => setFilter("purchased")}>
                {t("shop.purchased", { count: purchasedIds.length })}
              </button>
            </div>
          </div>

          <div className={s.sortGroup}>
            <label className={s.sortLabel}>{t("shop.sort")}</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={s.sortSelect}>
              <option value="name">{t("shop.sortName")}</option>
              <option value="price-low">{t("shop.sortLow")}</option>
              <option value="price-high">{t("shop.sortHigh")}</option>
              <option value="rarity">{t("shop.sortRarity")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className={s.productGrid}>
        {filteredProducts.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>🛍️</div>
            <h3 className={s.emptyTitle}>{t("shop.empty")}</h3>
            <p className={s.emptyDescription}>
              {searchQuery ? t("shop.emptySearch", { query: searchQuery }) : t("shop.emptyCategory")}
            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className={s.clearSearch}>
                {t("shop.clearSearch")}
              </button>
            )}
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isPurchased = purchasedIds.includes(product.id);
            const canAfford = user.points >= product.price;

            return (
              <div key={product.id} className={s.productWrapper}>
                {product.rarity === "legendary" && <div className={s.rarityBadge}>✨ {t("shop.legendary")}</div>}
                {product.rarity === "rare" && <div className={s.rarityBadge}>💎 {t("shop.rare")}</div>}

                <Shop
                  prefix={product}
                  onBuy={() => handleBuy(product)}
                  disabled={!canAfford || isPurchased || isLoading}
                  isPurchased={isPurchased}
                  canAfford={canAfford}
                />
              </div>
            );
          })
        )}
      </div>

      {purchasedIds.length > 0 && (
        <div className={s.statistics}>
          <h3 className={s.statsTitle}>{t("shop.statsTitle")}</h3>
          <div className={s.statsGrid}>
            <div className={s.statItem}>
              <span className={s.statValue}>{purchasedIds.length}</span>
              <span className={s.statLabel}>{t("shop.statsPurchased")}</span>
            </div>
            <div className={s.statItem}>
              <span className={s.statValue}>{getTotalValue().toLocaleString()}</span>
              <span className={s.statLabel}>{t("shop.statsSpent")}</span>
            </div>
            <div className={s.statItem}>
              <span className={s.statValue}>
                {Math.round((purchasedIds.length / PRODUCTS.length) * 100)}%
              </span>
              <span className={s.statLabel}>{t("shop.statsCollection")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Magaz;
