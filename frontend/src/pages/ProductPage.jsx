import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import s from "./ProductPage.module.scss";

const API_URL = "http://localhost:5000"; // backend URL

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState({ points: 0, purchasedItems: [] });
  const [isBought, setIsBought] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load product and user from backend
  useEffect(() => {
    // Fetch all products and find the one with this id
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.id === Number(id));
        setProduct(found || null);
      })
      .catch((err) => console.error("Error loading product:", err));

    // Fetch user
    fetch(`${API_URL}/user`)
      .then((res) => res.json())
      .then((userData) => setUser(userData))
      .catch((err) => console.error("Error loading user:", err));
  }, [id]);

  // Update bought state
  useEffect(() => {
    if (product && user?.purchasedItems) {
      const alreadyBought = user.purchasedItems.includes(product.id);
      setIsBought(alreadyBought);
    }
  }, [product, user]);

  if (!product) {
    return (
      <div className={s.notFound}>
        <div className={s.notFoundContent}>
          <h2>{t("shop_items.notFound")}</h2>
          <p>{t("shop_items.notFoundDescription")}</p>
          <Link to="/shop" className={s.backButton}>
            {t("shop_items.backToShop")}
          </Link>
        </div>
      </div>
    );
  }

  const handleBuyClick = () => {
    if (isBought) return;
    if (user.points >= product.price) {
      setShowConfirmModal(true);
    } else {
      alert(t("shop_items.fail"));
    }
  };

  const handleConfirmBuy = async () => {
    setIsLoading(true);
    setShowConfirmModal(false);

    try {
      const res = await fetch(`${API_URL}/user/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
        setIsBought(true);
        alert(t("shop_items.success"));
        navigate("/bought");
      } else {
        alert(data.error || t("shop_items.fail"));
      }
    } catch (error) {
      console.error("Error buying product:", error);
      alert(t("shop_items.fail"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBuy = () => {
    setShowConfirmModal(false);
  };

  const isPremium = product.category === "Premium";
  const canAfford = user.points >= product.price;

  return (
    <div className={s.container}>
      <div
        className={`${s.productCard} ${isPremium ? s.premium : ""} ${
          isLoading ? s.loading : ""
        }`}
      >
        <div className={s.imageSection}>
          <div className={s.imageContainer}>
            <img
              src={product.image}
              alt={t(product.name)}
              className={`${s.image} ${imageLoaded ? s.loaded : ""}`}
              onLoad={() => setImageLoaded(true)}
            />
            {isPremium && (
              <div className={s.premiumBadge}>{t("shop_items.premium")}</div>
            )}
          </div>
        </div>

        <div className={s.detailsSection}>
          <nav className={s.breadcrumb}>
            <Link to="/Shop" className={s.breadcrumbLink}>
              {t("shop_items.shop")}
            </Link>
            <span className={s.breadcrumbSeparator}>/</span>
            <span className={s.breadcrumbCurrent}>{t(product.name)}</span>
          </nav>

          <div className={s.statsBox}>
            <div>
              <strong>{t("shop_items.id")}:</strong> #{product.id}
            </div>
            <div>
              <strong>{t("shop_items.categoryLabel")}:</strong>{" "}
              {product.category || "—"}
            </div>
            <div>
              <strong>{t("shop_items.status")}:</strong>{" "}
              {isBought
                ? t("shop_items.statusBought")
                : t("shop_items.statusAvailable")}
            </div>
            <div>
              <strong>{t("shop_items.estimatedDelivery")}:</strong> 1–3{" "}
              {t("shop_items.days")}
            </div>
          </div>

          <h1 className={s.title}>{t(product.name)}</h1>
          <p className={s.description}>{t(product.description)}</p>

          <hr className={s.divider} />

          {product.features?.length > 0 && (
            <div className={s.features}>
              <h3 className={s.featuresTitle}>{t("shop_items.features")}</h3>
              <ul className={s.featuresList}>
                {product.features.map((feature, index) => (
                  <li key={index} className={s.featureItem}>
                    <span className={s.featureIcon}>✓</span>
                    {t(feature)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={s.priceSection}>
            <span className={s.price}>
              💰 {product.price.toLocaleString()} {t("shop_items.points")}
            </span>
            {!canAfford && (
              <span className={s.insufficientFunds}>
                {t("shop_items.need")}{" "}
                {(product.price - user.points).toLocaleString()}{" "}
                {t("shop_items.morePoints")}
              </span>
            )}
          </div>

          <div className={s.actions}>
            {!isBought && (
              <button
                className={s.buyButton}
                onClick={handleBuyClick}
                disabled={!canAfford}
              >
                {canAfford ? t("shop_items.buy") : t("shop_items.fail")}
              </button>
            )}

            <Link to="/Shop" className={s.backButton}>
              <span className={s.backIcon}>←</span>
              {t("shop_items.back")}
            </Link>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className={s.modalOverlay}>
          <div className={s.modal}>
            <h3 className={s.modalTitle}>{t("shop_items.confirmPurchase")}</h3>
            <p className={s.modalText}>
              {t("shop_items.confirmMessage", {
                name: t(product.name),
                price: product.price.toLocaleString(),
              })}
            </p>
            <div className={s.modalActions}>
              <button className={s.confirmButton} onClick={handleConfirmBuy}>
                {t("shop_items.confirmBuy")}
              </button>
              <button className={s.cancelButton} onClick={handleCancelBuy}>
                {t("shop_items.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
