import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import s from "./Login.module.scss";
import { useTranslation } from "react-i18next";

const Login = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}?username=${username}`
            );
            const user = res.data[0]; // Birinchi mos foydalanuvchi

            if (!user) {
                alert(t("login.user_not_found") || "Foydalanuvchi topilmadi");
                return;
            }

            if (user.password !== password) {
                alert(t("login.incorrect_password") || "Parol noto‘g‘ri");
                return;
            }

            alert(t("login.success") || "Kirish muvaffaqiyatli!");
            localStorage.setItem("loggedInUsername", username);
            navigate("/MainPage");
        } catch (error) {
            console.error("Login error:", error);
            alert(t("login.server_error") || "Serverda xatolik yuz berdi");
        }
    };

    return (
        <div className="container__main">
            <div className={s.formWrapper}>
                <h2 className={s.title}>
                    {t("login.title") || "Tizimga kirish"}
                </h2>
                <form onSubmit={handleLogin} className={s.form}>
                    <div className={s.flexColumn}>
                        <label htmlFor="username">
                            {t("login.username") || "Foydalanuvchi nomi"}
                        </label>
                    </div>
                    <div className={s.inputForm}>
                        <input
                            className={s.input}
                            type="text"
                            id="username"
                            placeholder={
                                t("login.username_placeholder") ||
                                "Ismingizni kiriting"
                            }
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className={s.flexColumn}>
                        <label htmlFor="password">
                            {t("login.password") || "Parol"}
                        </label>
                    </div>
                    <div className={s.inputForm}>
                        <input
                            className={s.input}
                            type="password"
                            id="password"
                            placeholder={
                                t("login.password_placeholder") ||
                                "Parolingizni kiriting"
                            }
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className={s.button} type="submit">
                        {t("login.login_button") || "Kirish"}
                    </button>

                    <p className={s.text}>
                        {t("login.no_account") || "Hisobingiz yo‘qmi?"}{" "}
                        <Link className={s.link} to="/register">
                            {t("login.register_link") || "Ro‘yxatdan o‘tish"}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
