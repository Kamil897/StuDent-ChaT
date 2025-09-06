import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_MAIN = "http://localhost:7777"; // backend-main
const API_LOGIN = "http://localhost:3000"; // backend-login

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [isBought, setIsBought] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ загрузка товара и пользователя
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const authHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        // продукты с backend-main
        const resProducts = await fetch(`${API_MAIN}/shop/products`);
        if (!resProducts.ok) throw new Error("Failed to load products");
        const data = await resProducts.json();
        const list = Array.isArray(data) ? data : [];
        const found = list.find((p) => String(p.id) === String(id));
        setProduct(found || null);

        // пользователь с backend-login
        const resUser = await fetch(`${API_LOGIN}/auth/me`, {
          headers: authHeaders,
        });
        if (!resUser.ok) throw new Error(`${resUser.status} Unauthorized`);
        const me = await resUser.json();

        setUser({
          id: me.id,
          points: me.karmaPoints || 0,
          purchasedItems: me.purchasedItems || [],
        });

        if (me.purchasedItems?.some((item) => String(item.id) === String(id))) {
          setIsBought(true);
        }
      } catch (err) {
        console.error("Error loading product/user:", err);
        navigate("/login");
      }
    };

    load();
  }, [id, navigate]);

  // ✅ покупка
  const handleConfirmBuy = async () => {
    setIsLoading(true);
    setShowConfirmModal(false);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_MAIN}/shop/user/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser({
          ...user,
          points: data.points,
          purchasedItems: data.purchasedItems,
        });
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

  if (!product) return <p>{t("loading")}...</p>;
  if (!user) return <p>{t("loading_user")}...</p>;

  return (
    <div className="product-page">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>
        {t("price")}: {product.price} {t("points")}
      </p>
      <p>
        {t("your_balance")}: {user.points} {t("points")}
      </p>

      {isBought ? (
        <button disabled>{t("shop_items.already_bought")}</button>
      ) : (
        <button disabled={isLoading} onClick={() => setShowConfirmModal(true)}>
          {isLoading ? t("loading") : t("shop_items.buy")}
        </button>
      )}

      {showConfirmModal && (
        <div className="modal">
          <p>{t("shop_items.confirm")}</p>
          <button onClick={handleConfirmBuy}>{t("yes")}</button>
          <button onClick={() => setShowConfirmModal(false)}>{t("no")}</button>
        </div>
      )}
    </div>
  );
}
