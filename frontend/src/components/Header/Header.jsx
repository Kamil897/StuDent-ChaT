import React, { useState, useEffect, useRef, createContext } from 'react';
import s from './Header.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const Header = () => {
  const [active, setActive] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();


  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeAndToggle = () => {
    CloseMenu();
    setIsOpen(false);
  };

  useEffect(() => {
    const username = localStorage.getItem('loggedInUsername');
    if (username) {
      const user = JSON.parse(localStorage.getItem(username));
      setUserData(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUsername');
    setUserData(null);
    navigate('/login');
  };

  const toggleBurger = () => {
    setActive(!active);
  };

  const CloseMenu = () => {
  setActive(false);
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add(s.dark);
      document.body.classList.remove(s.light);
    } else {
      document.body.classList.add(s.light);
      document.body.classList.remove(s.dark);
    }
  }, [isDarkMode]);

  return (
    <>
      <header className={s.header}>
        <div className={s.container__main}>
          <nav className={s.nav}>
            <div className={s.logo}>
              <Link onClick={CloseMenu} to={'/'} className={s.h1__logo}>
                StuDent ChaT
              </Link>

            </div>

            <div className={`${s.links} ${active ? s.active : ''}`}>
              <a href="/ChatGroup">{t("footer.groups")}</a>


              <Link className={s.teach} onClick={CloseMenu} to={'/AiChat'}>
                {t("footer.ai_assistant")}
              </Link>

                            {!userData ? (
                <div className={s.authButtons}>
                  <Link onClick={CloseMenu} to={'/login'}>
                    <button className={s.loginBtn}>{t("menu.login")}</button>
                  </Link>
                  <Link onClick={CloseMenu} to={'/register'}>
                    <button className={s.registerBtn}>{t("menu.register")}</button>
                  </Link>
                </div>
              ) : (
                

                <div className={s.userSection}>
                  <Link className={s.main} onClick={CloseMenu} to={'/MainPage'}>
                    <img
                      src={userData.avatar || '/profileimg.png'} 
                      alt="Avatar"
                      className={s.avatar}
                    />
                  </Link>
                </div>
              )}
            </div>

            
            <div
              onClick={toggleBurger}
              className={`${s.burger} ${active ? s.active : ''}`}
            >
              <span></span>
              <span></span>
            </div>

            
            <div className={s.langSwitcher}>
              <button onClick={() => i18n.changeLanguage('ru')}>RU</button>
              <button onClick={() => i18n.changeLanguage('en')}>EN</button>
              <button onClick={() => i18n.changeLanguage('uz')}>UZ</button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;