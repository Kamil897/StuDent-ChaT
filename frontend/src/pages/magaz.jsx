import React, { useState, useEffect } from "react";
import Shop from "../components/Shop/Shop";
import { useUser } from "../Context/UserContext";
import s from "./Magaz.module.scss";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const products = [
  {
    id: 1,
    name: "products.rainbow.name",
    description: "products.rainbow.description",
    image: "/raduga.webp",
    price: 1200,
    category: "design",
    rarity: "common"
  },
  {
    id: 3,
    name: "products.luxary.name",
    description: "products.luxary.description",
    image: "/luxary.webp",
    price: 600,
    category: "design",
    rarity: "common"
  },
  {
    id: 4,
    name: "products.omg.name",
    description: "products.omg.description",
    image: "/omg.webp",
    price: 2000,
    category: "special",
    rarity: "rare"
  },
  {
    id: 2,
    name: "products.kitty.name",
    description: "products.kitty.description",
    image: "/kitty.webp",
    price: 15000,
    category: "premium",
    rarity: "legendary"
  }
];


const Magaz = () => {
  const { user, spendPoints } = useUser();
  const { t } = useTranslation();

  const [purchasedItems, setPurchasedItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("purchasedItems") || "[]");
    setPurchasedItems(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("purchasedItems", JSON.stringify(purchasedItems));
  }, [purchasedItems]);

  const handleBuy = async (product) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (spendPoints(product.price)) {
      setPurchasedItems((prevItems) => [...prevItems, product]);
      showNotification(`✅ ${t(product.name)} ${t("shop.success")}`, "success");
    } else {
      showNotification(t("shop.insufficientFunds"), "error");
    }
    setIsLoading(false);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(""), 3000);
  };

  const filteredProducts = products
    .filter(product => {
      if (filter === "affordable") return user.points >= product.price;
      if (filter === "unaffordable") return user.points < product.price;
      if (filter === "purchased") return purchasedItems.some(item => item.id === product.id);
      return true;
    })
    .filter(product => {
      if (!searchQuery) return true;
        return t(product.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(product.description).toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "rarity":
          const rarityOrder = { common: 1, rare: 2, legendary: 3 };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        default:
          return 0;
      }
    });

  const getAffordableCount = () => {
    return products.filter(product => user.points >= product.price).length;
  };

  const getTotalValue = () => {
    return purchasedItems.reduce((sum, item) => sum + item.price, 0);
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
            {t("shop.available", { count: getAffordableCount(), total: products.length })}
          </p>
        </div>

        <div className={s.userInfo}>
          <div className={s.balance}>
            <span className={s.balanceLabel}>{t("shop.balance")}</span>
            <span className={s.balanceAmount}>{user.points.toLocaleString()}</span>
          </div>

          {purchasedItems.length > 0 && (
            <div className={s.purchaseInfo}>
              <span className={s.purchaseLabel}>{t("shop.spent")}</span>
              <span className={s.purchaseAmount}>{getTotalValue().toLocaleString()}</span>
            </div>
          )}

          <Link className={s.boughtLink} to="/bought">
            {t("shop.bought", { count: purchasedItems.length })}
          </Link>
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
              <button className={filter === "all" ? s.active : ""} onClick={() => setFilter("all")}>{t("shop.all", { count: products.length })}</button>
              <button className={filter === "affordable" ? s.active : ""} onClick={() => setFilter("affordable")}>{t("shop.affordable", { count: getAffordableCount() })}</button>
              <button className={filter === "unaffordable" ? s.active : ""} onClick={() => setFilter("unaffordable")}>{t("shop.unaffordable", { count: products.length - getAffordableCount() })}</button>
              <button className={filter === "purchased" ? s.active : ""} onClick={() => setFilter("purchased")}>{t("shop.purchased", { count: purchasedItems.length })}</button>
            </div>
          </div>

          <div className={s.sortGroup}>
            <label className={s.sortLabel}>{t("shop.sort")}</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className={s.sortSelect}
            >
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
              {searchQuery 
                ? t("shop.emptySearch", { query: searchQuery })
                : t("shop.emptyCategory")
              }
            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className={s.clearSearch}>
                {t("shop.clearSearch")}
              </button>
            )}
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isPurchased = purchasedItems.some(item => item.id === product.id);
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

                {isPurchased && <div className={s.purchasedOverlay}>✅ {t("shop.purchasedLabel")}</div>}
              </div>
            );
          })
        )}
      </div>

      {purchasedItems.length > 0 && (
        <div className={s.statistics}>
          <h3 className={s.statsTitle}>{t("shop.statsTitle")}</h3>
          <div className={s.statsGrid}>
            <div className={s.statItem}>
              <span className={s.statValue}>{purchasedItems.length}</span>
              <span className={s.statLabel}>{t("shop.statsPurchased")}</span>
            </div>
            <div className={s.statItem}>
              <span className={s.statValue}>{getTotalValue().toLocaleString()}</span>
              <span className={s.statLabel}>{t("shop.statsSpent")}</span>
            </div>
            <div className={s.statItem}>
              <span className={s.statValue}>
                {Math.round((purchasedItems.length / products.length) * 100)}%
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
