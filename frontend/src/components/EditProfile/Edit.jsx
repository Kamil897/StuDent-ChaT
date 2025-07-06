import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import s from './Edit.module.scss';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        hobby: '',
        education: '',
        username: '',
        password: '',
        avatar: '',
        avatarBorders: ''
    });

    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const username = localStorage.getItem('loggedInUsername');
        if (!username) {
            navigate('/login');
        } else {
            const user = JSON.parse(localStorage.getItem(username));
            setFormData(user);
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveChanges = () => {
        localStorage.setItem(formData.username, JSON.stringify(formData));
        alert(t('alertSaved'));
        navigate('/MainPage');
    };

    return (
        <div className="container__main">
            <div className={s.div}>
                <h2 className={s.h2}>{t('editTitle')}</h2>

                <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
                    <div className={s.img}>
                        <label htmlFor="avatar" className={s.imageUpload}>
                            <img
                                src={formData.avatar || 'profileimg.png'}
                                alt="Avatar"
                                className={s.uploadImage}
                            />
                        </label>
                        <input
                            type="file"
                            id="avatar"
                            name="avatar"
                            accept="image/*"
                            className={s.hiddenInput}
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

                    <div className={s.form}>
                        <div>
                            <label htmlFor="firstName">{t('labels.firstName')}</label>
                            <input
                                className={s.input}
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName">{t('labels.lastName')}</label>
                            <input
                                className={s.input}
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="hobby">{t('labels.hobby')}</label>
                            <input
                                className={s.input}
                                type="text"
                                id="hobby"
                                name="hobby"
                                value={formData.hobby}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="education">{t('labels.education')}</label>
                            <input
                                className={s.input}
                                type="text"
                                id="education"
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="avatarBorders">{t('labels.avatarBorders')}</label>
                            <select
                                id="avatarBorders"
                                name="avatarBorders"
                                className={s.input}
                                value={formData.avatarBorders}
                                onChange={handleChange}
                            >
                                <option value="">{t('avatarBorderOptions.none')}</option>
                                <option value="rounded">{t('avatarBorderOptions.rounded')}</option>
                                <option value="circle">{t('avatarBorderOptions.circle')}</option>
                                <option value="bordered">{t('avatarBorderOptions.bordered')}</option>
                            </select>
                        </div>
                    </div>
                    <button className={s.btn} type="submit">{t('saveChanges')}</button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
