import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Play, Search } from 'lucide-react';

import s from './Games.module.scss';
import { getMaxPoints } from '../utils/pointsHelper';

const Games = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [showCongrats, setShowCongrats] = useState(false);

  const [currentPoints, setCurrentPoints] = useState(() => {
    const savedPoints = localStorage.getItem('currentPoints');
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  });

  const maxPoints = getMaxPoints();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const games = [
    { id: 2, name: 'Snake', description: 'The classic Snake game...', link: '/Snake', image: 'https://play-lh.googleusercontent.com/xIDxenYWwwKdyDF2eYzSYhKUMVejc0AhOR64mpcY4keuwXP3UeI7yN1SnIJT4tpjgc4', category: 'Classic' },
    { id: 3, name: 'Tic Tac', description: 'Challenge your friends...', link: '/TicTacToe', image: 'https://cdn.pixabay.com/photo/2013/07/12/15/56/tic-tac-toe-150614_960_720.png', category: 'Board' },
    { id: 4, name: 'Тир', description: 'Test your aim...', link: '/Tir', image: 'https://storage.needpix.com/rsynced_images/archery-152912_1280.png', category: 'Action' },
    { id: 5, name: 'Лабиринт знаний', description: 'Navigate through a maze...', link: '/KnowledgeMaze', image: '/education.jpg', category: 'Educational' },
    { id: 6, name: 'Математический бой', description: 'Solve math problems...', link: '/MathBattle', image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj3mQCkWcLzOW-frEhIZ22Elqm6ljJMHzSgNj8hPhM3fjuZg60n7IIQc682tQmMg8umDkAalQ_SJjFrirFhqbPpsXFcsUgw2QwrXs7rQxECOP_cd2TMXOUFPpwKO6stMfeFcBCP_Mwy14-nsQwL60o-TIe_lAWYD3-s1qQ-4vmc68Omv7jkQFofX8hC/s1600/formula.jpg', category: 'Educational' },
    { id: 7, name: 'Камень, ножницы, бумага', description: 'The classic game of chance...', link: '/don', image: 'https://habrastorage.org/r/w1560/getpro/geektimes/post_images/28e/2a3/577/28e2a357753505ae9a7eb40097e93dbf.png', category: 'Classic' },
    { id: 8, name: 'Space Invaders', description: 'Defend Earth...', link: '/inviders', image: 'https://play-lh.googleusercontent.com/0goocG7RJZDZ41ShfBPl-h7ctwHKHjqzn4nSImyL8_RWyXqeYNKw-CdGAKhgPGZG5Es=w240-h480-rw', category: 'Arcade' },
    { id: 9, name: 'Ping Pong', description: 'Test your reflexes...', link: '/pingpong', image: 'https://cdn6.aptoide.com/imgs/8/0/7/807f37e41bb078de90a11c67a7857032_screen.png?w=245', category: 'Sports' },
    { id: 10, name: 'Meteors', description: 'Navigate your spaceship...', link: '/meteors', image: '/meteors.jpg', category: 'Action' },
    { id: 11, name: 'Tituls', description: 'Your Tituls', link: '/MyTituls', image: 'https://img.freepik.com/free-psd/medals-3d-render-champion-award-composition_314999-3096.jpg?semt=ais_hybrid&w=740', category: 'My tituls' }
  ];

  const categories = ['All', ...new Set(games.map(game => game.category))];

  const addPoints = (pointsToAdd = 500) => {
    const updated = currentPoints + pointsToAdd;
    setCurrentPoints(updated);
    localStorage.setItem('currentPoints', updated);

    if (updated >= maxPoints) {
      setShowCongrats(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const openModal = (game) => {
    setSelectedGame(game);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedGame(null);
    document.body.style.overflow = 'auto';
  };

  const playGame = (link) => {
    addPoints();
    closeModal();
    navigate(link);
  };

  const filteredGames = selectedCategory === 'All'
    ? games
    : games.filter(game => game.category === selectedCategory);

  return (
    <div className={s.container}>
      <button className={s.backButton} onClick={() => navigate('/MainPage')}>
        Назад
      </button>

      <div className={s.progressContainer}>
        <h3>Прогресс: {currentPoints} / {maxPoints}</h3>
        <div className={s.progressBar}>
          <div
            className={s.progressFill}
            style={{ width: `${(currentPoints / maxPoints) * 100}%` }}
          />
        </div>
        <div className={s.progressText}>
          {(currentPoints / maxPoints * 100).toFixed(1)}% выполнено
        </div>
      </div>

      <div className={s.filterSection}>
        {categories.map(category => (
          <button
            key={category}
            className={`${s.filterButton} ${selectedCategory === category ? s.active : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={s.gamesGrid}>
        {isLoading ? (
          Array(8).fill().map((_, index) => (
            <div key={`skeleton-${index}`} className={s.skeletonCard}></div>
          ))
        ) : filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div key={game.id} className={s.gameCard}>
              <div className={s.gameImageWrapper} onClick={() => openModal(game)}>
                <img src={game.image} alt={game.name} className={s.gameImage} />
                {game.category && <div className={s.categoryTag}>{game.category}</div>}
              </div>
              <div className={s.gameInfo}>
                <h3>{game.name}</h3>
                <button onClick={() => openModal(game)} className={s.infoButton}>
                  <Info size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={s.noGamesFound}>
            <Search size={48} />
            <p>No games found in this category</p>
          </div>
        )}
      </div>

      {selectedGame && (
        <div className={s.modalOverlay} onClick={closeModal}>
          <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2>{selectedGame.name}</h2>
            </div>
            <p>{selectedGame.description}</p>
            <button onClick={closeModal} className={s.closeButton}></button>
            <button
              onClick={() => playGame(selectedGame.link)}
              className={s.playButton}
            >
              <Play size={18} />
              Play Now
            </button>
          </div>
        </div>
      )}

      {showCongrats && (
        <div className={s.modalOverlay} onClick={() => {
          setShowCongrats(false);
          document.body.style.overflow = 'auto';
        }}>
          <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2>Поздравляем! 🎉</h2>
            </div>
            <p>Вы достигли максимального уровня прогресса!</p>
            <button
              className={s.playButton}
              onClick={() => {
                setShowCongrats(false);
                document.body.style.overflow = 'auto';
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Games;
