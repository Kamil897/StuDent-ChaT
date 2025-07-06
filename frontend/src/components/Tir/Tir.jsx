import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Context/UserContext';
import { useTranslation } from 'react-i18next';
import './Tir.css';

const Tir = () => {
  const { t } = useTranslation(); // без namespace
  const navigate = useNavigate();
  const { addPoints } = useUser(); 
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const intervalRef = useRef(null);

  const targetImages = [
    'url(/4_normal.png)', 
    'url(/4_normal.png)', 
    'url(/4_normal.png)'
  ];

  const generateTargets = () => {
    const newTargets = Array.from({ length: 3 }, () => {
      return {
        id: Math.random().toString(36).substr(2, 9),
        x: `${Math.random() * 90}%`,
        y: `${Math.random() * 70}%`,
        image: targetImages[Math.floor(Math.random() * targetImages.length)],
      };
    });
    setTargets((prev) => [...prev, ...newTargets].slice(-12));
  };

  useEffect(() => {
    if (!isMenuOpen && timeLeft > 0) {
      intervalRef.current = setInterval(generateTargets, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [isMenuOpen, timeLeft]);

  useEffect(() => {
    if (!isMenuOpen && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1200);
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen, timeLeft]);

  const resetGame = () => {
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    setIsMenuOpen(false);
  };

  const handleTargetClick = (id) => {
    setTargets((prev) => prev.filter((target) => target.id !== id));
    setScore((prev) => prev + 1);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      addPoints(score); 
    }
  }, [timeLeft, score, addPoints]);

  return (
    <div className="tir">
      {isMenuOpen ? (
        <div className="menu">
          <h1>{t("tir.title")}</h1>
          <button onClick={resetGame}>{t("tir.play")}</button>
          <button onClick={() => alert(t("tir.settings_alert"))}>{t("tir.settings")}</button>
          <button onClick={() => navigate('/Games')}>{t("tir.exit")}</button>
        </div>
      ) : (
        <>
          {timeLeft > 0 && (
            <header className="header">
              <h1>{t("tir.title")}</h1>
              <div className="info">
                <p>{t("tir.score")}: {score}</p>
                <p>{t("tir.time")}: {timeLeft}s</p>
              </div>
            </header>
          )}
          <main>
            {timeLeft === 0 ? (
              <div className="game-over">
                <h2>{t("tir.game_over")}</h2>
                <p>{t("tir.score")}: {score}</p>
                <button className="over-btn" onClick={() => setIsMenuOpen(true)}>{t("tir.back")}</button>
              </div>
            ) : (
              <div className="game-area">
                {targets.map((target) => (
                  <div
                    key={target.id}
                    className="target"
                    style={{
                      left: target.x,
                      top: target.y,
                      position: 'absolute',
                      backgroundImage: target.image, 
                      backgroundSize: 'cover',
                      width: '99px',
                      height: '92px',
                    }}
                    onClick={() => handleTargetClick(target.id)}
                  ></div>
                ))}
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default Tir;
