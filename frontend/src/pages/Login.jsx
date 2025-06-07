import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import s from './Login.module.scss';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                username,
                password,
            });

            // Например, токен и юзернейм приходят в ответе
            const { token, user } = response.data;

            // Сохраняем токен (можно в localStorage или context)
            localStorage.setItem('token', token);
            localStorage.setItem('loggedInUsername', user.username);

            alert('Вход успешен!');
            navigate('/MainPage');
        } catch (error) {
            console.error('Ошибка входа:', error);
            if (error.response && error.response.status === 401) {
                alert('Неверный логин или пароль');
            } else {
                alert('Ошибка сервера. Попробуйте позже.');
            }
        }
    };

    return (
        <div className="container__main">
            <div className={s.formWrapper}>
                <h2 className={s.title}>Вход</h2>
                <form onSubmit={handleLogin} className={s.form}>
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

                    <button className={s.button} type="submit">Войти</button>

                    <p className={s.text}>
                        Еще нет аккаунта?{' '}
                        <Link className={s.link} to="/register">Регистрация</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
