import React from 'react';
import s from './Footer.module.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={s.footer}>
      <div className={s.footer_content}>
        <div className={s.logo}>
          <img src="/Sdct.png" alt="" className={s.sdct} width="200" height="200" />
        </div>

        <nav className={s.footer_nav}>
          <div className={s.links}>
            <Link to="/ChatGroup">{t("footer.groups")}</Link>
            <Link to="/news">{t("footer.news")}</Link>
            <Link to="/news">{t("footer.institutions")}</Link>
            <Link to="/Teacher">{t("footer.teachers")}</Link>
            <br />
            <Link to="/AiChat">{t("footer.ai_assistant")}</Link>
            <Link to="/MainPage">{t("footer.account")}</Link>
          </div>
        </nav>

        <div className={s.footer_bottom}>
          <p>&copy; 2025 OOO STUDENTCHAT. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
