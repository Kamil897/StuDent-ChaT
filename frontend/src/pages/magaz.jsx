import React, { useState } from "react";
import Shop from "../components/Shop/Shop";
import { useUser } from "../Context/UserContext";
import s from "./Magaz.module.scss";
import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "Радужный", description: "Яркие краски, позитив и свобода!", image: "/raduga.webp", price: 1200, category: "design", rarity: "common" },
  { id: 3, name: "Просто но богато", image: "/luxary.webp", description: "Лаконичность и элегантность.", price: 600, category: "design", rarity: "common" },
  { id: 4, name: "ОМГ", description: "Вау-эффект гарантирован!", image: "/omg.webp", price: 2000, category: "special", rarity: "rare" },
  { id: 2, name: "Котики", description: "Мур-мур! С этой привилегией вы получаете пушистую дозу уюта.", image: "/kitty.webp", price: 15000, category: "premium", rarity: "legendary" }
];

const Magaz = () => {
  const { user, spendPoints } = useUser();
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const handleBuy = async (product) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    if (spendPoints(product.price)) {
      setPurchasedItems((prevItems) => [...prevItems, product]);
      showNotification(`✅ ${product.name} успешно куплен!`, "success");
    } else {
      showNotification("❌ Недостаточно средств!", "error");
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
      return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             product.description.toLowerCase().includes(searchQuery.toLowerCase());
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
          <h1 className={s.title}>Магазин привилегий</h1>
          <p className={s.subtitle}>
            Доступно: {getAffordableCount()} из {products.length} товаров
          </p>
        </div>
        
        <div className={s.userInfo}>
          <div className={s.balance}>
            <span className={s.balanceLabel}>Баланс</span>
            <span className={s.balanceAmount}>{user.points.toLocaleString()}</span>
          </div>
          
          {purchasedItems.length > 0 && (
            <div className={s.purchaseInfo}>
              <span className={s.purchaseLabel}>Потрачено</span>
              <span className={s.purchaseAmount}>{getTotalValue().toLocaleString()}</span>
            </div>
          )}
          
          <Link className={s.boughtLink} to="/bought">
            Куплено ({purchasedItems.length})
          </Link>
        </div>
      </header>

      <div className={s.controls}>
        <div className={s.searchSection}>
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={s.searchInput}
          />
        </div>

        <div className={s.filtersSection}>
          <div className={s.filterGroup}>
            <label className={s.filterLabel}>Фильтр:</label>
            <div className={s.filters}>
              <button className={filter === "all" ? s.active : ""} onClick={() => setFilter("all")}>Все ({products.length})</button>
              <button className={filter === "affordable" ? s.active : ""} onClick={() => setFilter("affordable")}>Доступные ({getAffordableCount()})</button>
              <button className={filter === "unaffordable" ? s.active : ""} onClick={() => setFilter("unaffordable")}>Недоступные ({products.length - getAffordableCount()})</button>
              <button className={filter === "purchased" ? s.active : ""} onClick={() => setFilter("purchased")}>Купленные ({purchasedItems.length})</button>
            </div>
          </div>

          <div className={s.sortGroup}>
            <label className={s.sortLabel}>Сортировка:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className={s.sortSelect}
            >
              <option value="name">По названию</option>
              <option value="price-low">Сначала дешевые</option>
              <option value="price-high">Сначала дорогие</option>
              <option value="rarity">По редкости</option>
            </select>
          </div>
        </div>
      </div>

      <div className={s.productGrid}>
        {filteredProducts.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>🛍️</div>
            <h3 className={s.emptyTitle}>Товары не найдены</h3>
            <p className={s.emptyDescription}>
              {searchQuery 
                ? `По запросу "${searchQuery}" ничего не найдено`
                : "В данной категории пока нет товаров"
              }
            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className={s.clearSearch}>
                Очистить поиск
              </button>
            )}
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isPurchased = purchasedItems.some(item => item.id === product.id);
            const canAfford = user.points >= product.price;
            
            return (
              <div key={product.id} className={s.productWrapper}>
                {product.rarity === "legendary" && <div className={s.rarityBadge}>✨ Легендарный</div>}
                {product.rarity === "rare" && <div className={s.rarityBadge}>💎 Редкий</div>}
                
                <Shop 
                  prefix={product} 
                  onBuy={() => handleBuy(product)}
                  disabled={!canAfford || isPurchased || isLoading}
                  isPurchased={isPurchased}
                  canAfford={canAfford}
                />
                
                {isPurchased && <div className={s.purchasedOverlay}>✅ Куплено</div>}
              </div>
            );
          })
        )}
      </div>

      {purchasedItems.length > 0 && (
        <div className={s.statistics}>
          <h3 className={s.statsTitle}>Статистика покупок</h3>
          <div className={s.statsGrid}>
            <div className={s.statItem}>
              <span className={s.statValue}>{purchasedItems.length}</span>
              <span className={s.statLabel}>Товаров куплено</span>
            </div>
            <div className={s.statItem}>
              <span className={s.statValue}>{getTotalValue().toLocaleString()}</span>
              <span className={s.statLabel}>Потрачено баллов</span>
            </div>
            <div className={s.statItem}>
              <span className={s.statValue}>
                {Math.round((purchasedItems.length / products.length) * 100)}%
              </span>
              <span className={s.statLabel}>Коллекция</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Magaz;
