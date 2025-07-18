import s from "./HomeHero.module.scss";
import React, { useState, useEffect, useRef } from "react";
import SpotlightCard from "../SpotlightCard/SpotlightCard.jsx";
import Tabs from "../Tabs/Tabs.jsx";
import TextCursor from "../TextCursor/TextCursor.jsx";
import { useTranslation } from "react-i18next";

const HomeHero = () => {
    const tooltipRef = useRef(null);
    const { t } = useTranslation();

    useEffect(() => {
        const handleMouseMove = (event) => {
            const tooltip = tooltipRef.current;
            if (!tooltip) return;

            const tooltipRect = tooltip.getBoundingClientRect();
            const positionX =
                ((event.clientX - tooltipRect.left) / tooltipRect.width) * 100;
            const positionY =
                ((event.clientY - tooltipRect.top) / tooltipRect.height) * 100;

            tooltip.style.setProperty("--position-x", `${positionX}%`);
            tooltip.style.setProperty("--position-y", `${positionY}%`);
        };

        const tooltip = tooltipRef.current;
        if (tooltip) {
            tooltip.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            if (tooltip) {
                tooltip.removeEventListener("mousemove", handleMouseMove);
            }
        };
    }, []);

    return (
        <>
            <section className={s.welcome_section}>
                <h1>Student Chat</h1>
                <h3>{t("help")}</h3>
                <TextCursor
                    text={t("text_cursor")}
                    delay={0.01}
                    spacing={200}
                    followMouseDirection={true}
                    randomFloat={true}
                    exitDuration={0.3}
                    removalInterval={40}
                    maxPoints={10}
                />
            </section>

            <section className={s.active} id="section-О нас">
                <div className={s.home_wrapper}>
                    <h2 className={s.home_title}>{t("about.title")}</h2>
                    <p className={s.home_text}>{t("about.description")}</p>
                </div>
                <div className={s.home_img}>
                    <img src="/hi.svg" alt="" />
                </div>
            </section>

            <section className={s.services} id="section-Наши преимущество">
                <h1 style={{
                        textAlign: "center",
                        color: "#fff",
                        fontSize: "42px",
                        marginBottom: "60px",
                        paddingTop: "40px",
                    }}>
                    {t("actions_section_title")}
                </h1>
                <Tabs />
            </section>

            <section className={s.spotlight__cards}>
                <h1 style={{
                        textAlign: "center",
                        color: "#fff",
                        fontSize: "42px",
                        marginBottom: "60px",
                        paddingTop: "40px",
                    }}>
                    {t("how_we_help.title")}
                </h1>

                <div className={s.sCards}>
                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                        <h2 className={s.item_title}>{t("how_we_help.sections.community.title")}</h2>
                        <p className={s.item_text}>{t("how_we_help.sections.community.content")}</p>
                    </SpotlightCard>

                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                        <h2 className={s.item_title}>{t("how_we_help.sections.flexibility.title")}</h2>
                        <p className={s.item_text}>{t("how_we_help.sections.flexibility.content")}</p>
                    </SpotlightCard>

                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                        <h2 className={s.item_title}>{t("how_we_help.sections.skills.title")}</h2>
                        <p className={s.item_text}>{t("how_we_help.sections.skills.content")}</p>
                    </SpotlightCard>
                </div>
            </section>

            <section className={s.our_users}>
                <h1 className={s.our_users_title} id="section-Почему выбирают нас">
                    {t("why_us.title")}
                </h1>

                <div className={s.content_our}>
                    <div className={s.item}>
                        <img className={s.item_img} src="/chart.png" alt="График" />
                        <h2 className={s.item_text_desc}>{t("why_us.reasons.availability.title")}</h2>
                        <p className={s.item_text_decor}>{t("why_us.reasons.availability.content")}</p>
                    </div>

                    <div className={s.item}>
                        <img className={s.item_img} src="/laptop.png" alt="Ноутбук" />
                        <h2 className={s.item_text_desc}>{t("why_us.reasons.mentors.title")}</h2>
                        <p className={s.item_text_decor}>{t("why_us.reasons.mentors.content")}</p>
                    </div>

                    <div className={s.item}>
                        <img className={s.item_img} src="/house.png" alt="" />
                        <h2 className={s.item_text_desc}>{t("why_us.reasons.safe_space.title")}</h2>
                        <p className={s.item_text_decor}>{t("why_us.reasons.safe_space.content")}</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomeHero;
