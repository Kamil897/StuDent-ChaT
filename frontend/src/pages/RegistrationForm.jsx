import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import s from './Registration.module.scss';
import api from '../components/utils/axios';

const Registration = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'USER',
      });

      alert('Успешно! Теперь войдите.');
      navigate('/login');
    } catch (err) {
      alert(err?.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <form className={s.form} onSubmit={handleRegister}>
      <div className={s.inputBlock}>
        <label>Имя пользователя</label>
        <input
          className={s.input}
          type="text"
          name="username"
          placeholder="Введите имя"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className={s.inputBlock}>
        <label>Email</label>
        <input
          className={s.input}
          type="email"
          name="email"
          placeholder="Введите email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className={s.inputBlock}>
        <label>Пароль</label>
        <input
          className={s.input}
          type="password"
          name="password"
          placeholder="Введите пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button className={s.button_submit} type="submit">Зарегистрироваться</button>

      <p className={s.p}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </form>
  );
};

export default Registration;
