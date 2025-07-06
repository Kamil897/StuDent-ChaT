import { Link, useNavigate } from 'react-router-dom';
import s from './MainPage.module.scss';
import { useEffect, useState } from 'react';
import Dock from '../Dock/Dock.jsx';
import { useTranslation } from 'react-i18next';

const MainPage = () => {
  const { t } = useTranslation();
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
                <p><b>{t("main.first_name")}: </b>{userData.firstName}</p>
                <p><b>{t("main.last_name")}:</b> {userData.lastName}</p>
                <p><b>{t("main.hobby")}:</b> {userData.hobby}</p>
                <p><b>{t("main.education")}:</b> {userData.education}</p>
              </div>
            </div>
          </div>
          <Dock />
        </div>
      ) : (
        <p>{t("main.loading")}</p>
      )}
    </>
  );
};

export default MainPage;
