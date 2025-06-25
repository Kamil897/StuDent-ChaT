import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import s from './Login.module.scss';
import api from '../components/utils/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password }); // исправлено!
      const token = res.data.access_token;
  
      localStorage.setItem('access_token', token);
  
      const payload = JSON.parse(atob(token.split('.')[1]));
  
      if (payload.role === 'user') {
        navigate('/MainPage');
      } else if (payload.role === 'admin') {
        navigate('/admin');
      } else {
        alert('У вас нет доступа к пользовательским страницам.');
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Ошибка входа');
    }
  };
  
  

  return (
    <div className="container__main">
      <div className={s.formWrapper}>
        <h2 className={s.title}>Вход</h2>
        <form onSubmit={handleLogin} className={s.form}>
          <div className={s.flexColumn}>
            <label htmlFor="email">Email</label>
          </div>
          <div className={s.inputForm}>
            <input
              className={s.input}
              type="email"
              id="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={s.flexColumn}>
            <label htmlFor="password">Пароль</label>
          </div>
          <div className={s.inputForm}>
            <input
              className={s.input}
              type="password"
              id="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className={s.button} type="submit">Войти</button>

          <p className={s.text}>
            Нет аккаунта? <Link className={s.link} to="/register">Регистрация</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
