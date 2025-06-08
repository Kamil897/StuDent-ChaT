import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './MyTituls.module.scss';

const MyTituls = ({ snakeScore, rpsWins, flappyScore }) => {
  const [titlesUnlocked, setTitlesUnlocked] = useState([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const missionConditions = useMemo(() => ({
    snakeScore20: {
      condition: snakeScore >= 20,
      title: 'Мастер змейки 🐍',
      requirement: 'Сделать счёт 20 в Змейке',
    },
    rpsWins30: {
      condition: rpsWins >= 30,
      title: 'Чемпион РПС ✊✋✌️',
      requirement: 'Выиграть 30 раз в Камень-Ножницы-Бумага',
    },
    flappyScore100: {
      condition: flappyScore >= 100,
      title: 'Летун 100 уровня 🐤',
      requirement: 'Сделать счёт 100 в Flappy Bird',
    },
  }), [snakeScore, rpsWins, flappyScore]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('titlesUnlocked')) || [];
    setTitlesUnlocked(saved);
  }, []);

  useEffect(() => {
    setTitlesUnlocked((prev) => {
      const newTitles = Object.values(missionConditions)
        .filter(({ condition, title }) => condition && !prev.includes(title))
        .map(({ title }) => title);

      if (newTitles.length === 0) return prev;

      const updated = [...prev, ...newTitles];
      setNewlyUnlocked(newTitles);
      localStorage.setItem('titlesUnlocked', JSON.stringify(updated));

      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.warn('Audio play error:', err);
        });
      }

      const timer = setTimeout(() => setNewlyUnlocked([]), 3000);
      return () => clearTimeout(timer);

      return updated;
    });
  }, [missionConditions]);

console.log('RPS Wins:', rpsWins);


  return (
    <section className={s.section}>
      <div className="container">
        <div className={s.wrap}>
          <button className={s.backButton} onClick={() => navigate(-1)}>
            ← Назад
          </button>

          <h2>Твои титулы</h2>

          <audio ref={audioRef} src="/success.mp3" preload="auto" />

          {newlyUnlocked.length > 0 && (
            <div className={s.congrats}>
              🎉 Поздравляем! Вы получили титул:
              <strong> {newlyUnlocked.join(', ')}</strong>
            </div>
          )}

          <ul>
            {Object.entries(missionConditions).map(([key, { title, requirement }]) => {
              const unlocked = titlesUnlocked.includes(title);
              return (
                <li key={key} className={unlocked ? s.unlocked : s.locked}>
                  {unlocked ? (
                    <span>{title} ✅</span>
                  ) : (
                    <span>{requirement} — титул заблокирован 🔒</span>
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
