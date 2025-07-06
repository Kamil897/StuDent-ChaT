import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import s from './MyTituls.module.scss';

const MyTituls = ({ snakeScore, rpsWins, flappyScore }) => {
  const { t } = useTranslation();
  const [titlesUnlocked, setTitlesUnlocked] = useState([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const missionConditions = useMemo(() => ({
    snakeScore20: {
      condition: snakeScore >= 20,
      id: 'snake',
      title: t('titles.snake.title'),
      requirement: t('titles.snake.requirement'),
    },
    rpsWins30: {
      condition: rpsWins >= 30,
      id: 'rps',
      title: t('titles.rps.title'),
      requirement: t('titles.rps.requirement'),
    },
    flappyScore100: {
      condition: flappyScore >= 100,
      id: 'flappy',
      title: t('titles.flappy.title'),
      requirement: t('titles.flappy.requirement'),
    },
  }), [snakeScore, rpsWins, flappyScore, t]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('titlesUnlocked')) || [];
    setTitlesUnlocked(saved);
  }, []);

  useEffect(() => {
    setTitlesUnlocked((prev) => {
      const prevIds = prev || [];

      const newIds = Object.values(missionConditions)
        .filter(({ condition, id }) => condition && !prevIds.includes(id))
        .map(({ id }) => id);

      if (newIds.length === 0) return prev;

      const updated = [...prevIds, ...newIds];
      setNewlyUnlocked(newIds);
      localStorage.setItem('titlesUnlocked', JSON.stringify(updated));

      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.warn('Audio play error:', err);
        });
      }

      return updated;
    });

    const timer = setTimeout(() => setNewlyUnlocked([]), 3000);
    return () => clearTimeout(timer);
  }, [missionConditions]);

  return (
    <section className={s.section}>
      <div className="container">
        <div className={s.wrap}>
          <button className={s.backButton} onClick={() => navigate(-1)}>
            ← {t('titles.back')}
          </button>

          <h2>{t('titles.yourTitles')}</h2>

          <audio ref={audioRef} src="/success.mp3" preload="auto" />

          {newlyUnlocked.length > 0 && (
            <div className={s.congrats}>
              🎉 {t('titles.congrats')}: <strong>
                {newlyUnlocked.map(id => t(`titles.${id}.title`)).join(', ')}
              </strong>
            </div>
          )}

          <ul>
            {Object.entries(missionConditions).map(([key, { title, requirement, id }]) => {
              const unlocked = titlesUnlocked.includes(id);
              return (
                <li key={key} className={unlocked ? s.unlocked : s.locked}>
                  {unlocked ? (
                    <span>{title} ✅</span>
                  ) : (
                    <span>{requirement} — {t('titles.locked')}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default MyTituls;
