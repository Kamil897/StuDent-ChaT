import { Link, useNavigate } from 'react-router-dom';
import s from './MainPage.module.scss';
import { useEffect, useState } from 'react';
import Dock from '../Dock/Dock.jsx';

const  MainPage = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem('loggedInUsername');
        if (!username) {
            navigate('/login');
        } else {
            const user = JSON.parse(localStorage.getItem(username));
            setUserData(user);
        }
    }, [navigate]);

    return (
        <>
            {userData ? (
                <div className={s.sects}>
                    <div className={s.section_2}>
                        <div className={s.main}>
                            <img
                                className={`${userData.avatar ? s.pfp : s.defoltpfp} ${userData.avatarBorders ? s[userData.avatarBorders] : ''}`}
                                src={userData.avatar || 'profileimg.png'}
                                alt="profile"
                            />
                            <div className={s.info}>
                                <h2 className={s.username}><b>{userData.firstName} {userData.lastName}</b></h2>
                                <p><b>Имя: </b>{userData.firstName}</p>
                                <p><b>Фамилия:</b> {userData.lastName}</p>
                                <p><b>Хобби:</b> {userData.hobby}</p>
                                <p><b>Образование/Работа:</b> {userData.education}</p>
                                <p></p>
                            </div>
                        </div>
                    </div>
                            <Dock />
                </div>
            ) : (
                <p>Загрузка...</p>
            )}
        </>
    );
};

export default MainPage;
