import React, { useState, useEffect, useRef, createContext } from 'react';
import s from './Header.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import GoogleTranslate from '../Google/GoogleTranslate';

const Header = () => {
  const [active, setActive] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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
              <a href="/ChatGroup">Группа</a>

              <div className={s.dropdownWrapper}>
                <button className={s.dropdownToggle} onClick={toggleDropdown}>
                  Новости
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13.5306 6.53063L8.53063 11.5306C8.46095 11.6005..."
                      fill="black"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <ul className={s.dropdownMenu}>
                    <li><Link onClick={closeAndToggle} to="/news">Все новости</Link></li>
                    <li><Link onClick={closeAndToggle} to="/Society">Общество</Link></li>
                    <li><Link onClick={closeAndToggle} to="/Tech">Технологии</Link></li>
                    <li><Link onClick={closeAndToggle} to="/Culture">Культура</Link></li>
                  </ul>
                )}
              </div>

              <Link className={s.teach} onClick={CloseMenu} to={'/Teacher'}>Учителя</Link>

              <Link className={s.teach} onClick={CloseMenu} to={'/AiChat'}>ИИ помошник</Link>

              
              {!userData ? (
                <>
                  <Link onClick={CloseMenu} to={'/register'}>
                    <button className={s.reg}><img src="/user.svg" alt="profile" /></button>
                  </Link>
                </>
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
            <GoogleTranslate />

          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;