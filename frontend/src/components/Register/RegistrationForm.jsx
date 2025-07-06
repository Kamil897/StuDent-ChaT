import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import s from './Registration.module.scss';
import { useTranslation } from 'react-i18next';

const Registration = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    hobby: '',
    education: '',
    username: '',
    password: '',
    avatar: '',
    birth: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const existingUser = localStorage.getItem(formData.username);
    if (existingUser) {
      alert(t('register.already_exists'));
      return;
    }

    let calculatedAge = null;

    if (formData.birth) {
      const birthDateObj = new Date(formData.birth);
      const today = new Date();
      calculatedAge = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        calculatedAge--;
      }
    }

    const userData = {
      ...formData,
      age: calculatedAge,
    };

    localStorage.setItem(formData.username, JSON.stringify(userData));
    alert(t('register.success'));
    navigate('/login');
  };

  return (
    <form className={s.form} onSubmit={handleRegister}>
      {/* Аватарка */}
      <div className={s.img}>
        <label htmlFor="avatar" className={s.imageUpload}>
          <img
            src={formData.avatar || 'profileimg.png'}
            alt={t('register.avatar')}
            className={s.uploadImage}
          />
        </label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                setFormData({
                  ...formData,
                  avatar: reader.result,
                });
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>

      {/* Поля */}
      {[
        { name: 'firstName', label: t('register.first_name'), placeholder: t('register.enter_first_name') },
        { name: 'lastName', label: t('register.last_name'), placeholder: t('register.enter_last_name') },
        { name: 'email', label: t('register.email'), placeholder: t('register.enter_email'), type: 'email' },
        { name: 'hobby', label: t('register.hobby'), placeholder: t('register.enter_hobby') },
        { name: 'education', label: t('register.education'), placeholder: t('register.enter_education') },
        { name: 'birth', label: t('register.birth'), type: 'date' },
        { name: 'username', label: t('register.username'), placeholder: t('register.enter_username') },
        { name: 'password', label: t('register.password'), placeholder: t('register.enter_password'), type: 'password' },
      ].map(({ name, label, placeholder, type = 'text' }) => (
        <div key={name}>
          <div className={s.flex_column}>
            <label>{label}</label>
          </div>
          <div className={s.inputForm}>
            <input
              className={s.input}
              placeholder={placeholder}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required={name === 'password'}
            />
          </div>
        </div>
      ))}

      {/* Кнопка */}
      <button className={s.button_submit} type="submit">
        {t('register.register_button')}
      </button>

      {/* Ссылка на вход */}
      <p className={s.p}>
        {t('register.have_account')}{' '}
        <span className={s.span}>
          <Link to="/login">{t('register.login_link')}</Link>
        </span>
      </p>
    </form>
  );
};

export default Registration;
