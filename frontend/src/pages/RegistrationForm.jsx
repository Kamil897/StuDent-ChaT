import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import s from './Login.module.scss';

const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', {
                username,
                password,
            });

            if (response.status === 201 || response.status === 200) {
                alert('Регистрация прошла успешно');
                navigate('/login');
            } else {
                alert('Что-то пошло не так при регистрации');
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            if (error.response && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Ошибка сервера при регистрации');
            }
        }
    };

    return (
        <div className="container__main">
            <div className={s.formWrapper}>
                <h2 className={s.title}>Регистрация</h2>
                <form onSubmit={handleRegister} className={s.form}>
                    <div className={s.flexColumn}>
                        <label htmlFor="username">Имя пользователя</label>
                    </div>
                    <div className={s.inputForm}>
                        <input
                            className={s.input}
                            type="text"
                            id="username"
                            placeholder="Введите имя пользователя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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

                    <div className={s.flexColumn}>
                        <label htmlFor="confirmPassword">Подтвердите пароль</label>
                    </div>
                    <div className={s.inputForm}>
                        <input
                            className={s.input}
                            type="password"
                            id="confirmPassword"
                            placeholder="Подтвердите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className={s.button} type="submit">Зарегистрироваться</button>

                    <p className={s.text}>
                        Уже есть аккаунт?{' '}
                        <Link className={s.link} to="/login">Войти</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Registration;
