import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { useTranslation } from "react-i18next";
import s from "./ProductPage.module.scss";

const products = [
  {
    id: 1,
    name: "products.rainbow.name",
    image: "/raduga.webp",
    description: "products.rainbow.description",
    price: 1200
  },
  {
    id: 2,
    name: "products.kitty.name",
    image: "/kitty.webp",
    description: "products.kitty.description",
    price: 15000
  },
  {
    id: 3,
    name: "products.luxary.name",
    image: "/luxary.webp",
    description: "products.luxary.description",
    price: 600
  },
  {
    id: 4,
    name: "products.omg.name",
    image: "/omg.webp",
    description: "products.omg.description",
    price: 2000
  }
];

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, spendPoints } = useUser();
  const { t } = useTranslation();

  const product = products.find((p) => p.id === Number(id));
  const [isBought, setIsBought] = useState(false);

  useEffect(() => {
    if (product && user?.purchasedItems) {
      const alreadyBought = user.purchasedItems.some((item) => item.id === product.id);
      setIsBought(alreadyBought);
    }
  }, [product, user]);

  if (!product) {
    return <div className={s.notFound}>{t("product.notFound")}</div>;
  }

  const handleBuy = () => {
    if (spendPoints(product.price, product)) {
      setIsBought(true);
      alert(t("product.success"));
      navigate("/bought");
    } else {
      alert(t("product.fail"));
    }
  };

  return (
    <div className={s.container}>
      <div className={s.productCard}>
        <div className={s.imageSection}>
          <img src={product.image} alt={t(product.name)} className={s.image} />
        </div>

        <div className={s.detailsSection}>
          <h1 className={s.title}>{t(product.name)}</h1>
          <p className={s.description}>{t(product.description)}</p>
          <span className={s.price}>💰 {product.price} {t("product.points")}</span>

          <div className={s.actions}>
            {isBought ? (
              <button className={s.disabledButton} disabled>{t("product.bought")}</button>
            ) : user.points >= product.price ? (
              <button className={s.buyButton} onClick={handleBuy}>{t("product.buy")}</button>
            ) : (
              <button className={s.disabledButton} disabled>{t("product.notEnough")}</button>
            )}
            <Link to="/Shop" className={s.backButton}>{t("product.back")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
