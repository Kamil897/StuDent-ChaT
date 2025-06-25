import React, { useState, useEffect, useRef, createContext } from 'react';
import s from './Footer.module.scss';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
      <footer className={s.footer}>
      <div className={s.footer_content}>
        <div className={s.logo}>
          <img src="/Sdct.png" alt="" className={s.sdct} width="200" height="200"/>
        </div>
        <nav className={s.footer_nav}>
          <div className={s.links}>
             <Link to={"/ChatGroup"}>Группы</Link>
             <Link to={"/news"}>Новости</Link> 
             <Link to={"/news"}>Институты</Link>
             <Link to={"/Teacher"}>Учителя</Link> 
             <br />
             <Link to={"/AiChat"}>ИИ помошник</Link>
             <Link to={"/MainPage"}>Мой аккаунт</Link>
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
