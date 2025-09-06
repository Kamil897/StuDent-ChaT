import React, { useState, useEffect } from "react";
import styles from "./Leaderboard.module.scss";
import { getLeaderboard, getUserStats } from "../utils/gamesApi";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("games"); // games | shop
  const [currentPage, setCurrentPage] = useState(1);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState("snake");
  const itemsPerPage = 10;

  const games = [
    { name: "snake", label: "Snake" },
    { name: "asteroids", label: "Asteroids" },
    { name: "pingpong", label: "Ping Pong" },
    { name: "tictactoe", label: "Tic Tac Toe" },
    { name: "mathbattle", label: "Math Battle" },
    { name: "tir", label: "Tir" },
    { name: "knowledgemaze", label: "Knowledge Maze" },
    { name: "don", label: "Don" },
  ];

  useEffect(() => {
    loadLeaderboard();
  }, [selectedGame]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await getLeaderboard(selectedGame, 50);
      setLeaderboardData(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPlayers = leaderboardData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className={styles.leaderboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>Лидерборд</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "games" ? styles.isActive : ""}`}
            onClick={() => setActiveTab("games")}
          >
            Очки по играм
          </button>
          <button
            className={`${styles.tab} ${activeTab === "shop" ? styles.isActive : ""}`}
            onClick={() => setActiveTab("shop")}
          >
            Баллы в магазине
          </button>
        </div>
        {activeTab === "games" && (
          <div className={styles.gameSelector}>
            <select 
              value={selectedGame} 
              onChange={(e) => setSelectedGame(e.target.value)}
              className={styles.gameSelect}
            >
              {games.map(game => (
                <option key={game.name} value={game.name}>
                  {game.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      <div className={styles.panels}>
        {activeTab === "games" && (
          <div className={styles.panel}>
            {loading ? (
              <div className={styles.loading}>Загрузка...</div>
            ) : (
              <div className={styles.table}>
                <div className={`${styles.row} ${styles.head}`}>
                  <div className={styles.cell}>#</div>
                  <div className={styles.cell}>Игрок</div>
                  <div className={styles.cell}>Очки</div>
                  <div className={styles.cell}>Ранг</div>
                </div>
                {currentPlayers.length === 0 ? (
                  <div className={styles.emptyState}>
                    Нет данных для отображения
                  </div>
                ) : (
                  currentPlayers.map((p, i) => (
                    <div className={styles.row} key={p.id}>
                      <div className={styles.cell}>{startIndex + i + 1}</div>
                      <div className={`${styles.cell} ${styles.playerCell}`}>
                        <div className={styles.player}>
                          <div className={styles.avatar}>
                            {p.user?.avatar && (
                              <img src={p.user.avatar} alt="Avatar" />
                            )}
                          </div>
                          <div className={styles.playerInfo}>
                            <span className={styles.playerName}>
                              {p.user?.name || p.user?.email || 'Unknown'}
                            </span>
                            <span className={styles.playerTag}>
                              @{p.user?.id || 'user'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`${styles.cell} ${styles.points}`}>{p.score}</div>
                      <div className={styles.cell}>{p.rank || '—'}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "shop" && (
          <div className={styles.panel}>
            <div className={styles.table}>
              <div className={`${styles.row} ${styles.head}`}>
                <div className={styles.cell}>#</div>
                <div className={styles.cell}>Игрок</div>
                <div className={styles.cell}>Бонусы</div>
                <div className={styles.cell}>Потрачено</div>
                <div className={styles.cell}>Баланс</div>
              </div>
              {currentPlayers.map((p, i) => (
                <div className={styles.row} key={p.id}>
                  <div className={styles.cell}>{startIndex + i + 1}</div>
                  <div className={`${styles.cell} ${styles.playerCell}`}>
                    <div className={styles.player}>
                      <div className={styles.avatar} />
                      <div className={styles.playerInfo}>
                        <span className={styles.playerName}>{p.name}</span>
                        <span className={styles.playerTag}>{p.tag}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.cell}>{p.bonuses}</div>
                  <div className={styles.cell}>{p.spent}</div>
                  <div className={`${styles.cell} ${styles.points}`}>
                    {p.bonuses - p.spent}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`${styles.pageBtn} ${
                currentPage === i + 1 ? styles.isActive : ""
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      </footer>
    </section>
  );
}



/* =========================
   ИНСТРУКЦИЯ ПО ПОДКЛЮЧЕНИЮ К БЭКУ (NestJS, TypeScript) И БД — КРАТКО
   Всё ниже — комментарий; вырезайте/переносите в Wiki по желанию.
   1) Архитектура и модели
      - Две сущности (минимум):
        User { id: string; username: string; avatarUrl?: string; }
        Score {
          id: string;
          userId: string (FK -> User);
          type: "games_total" | "shop_points";
          value: number;              // суммарные очки/баллы
          wins?: number;              // для игр
          gamesPlayed?: number;       // для игр
          spent?: number;             // для магазина
          updatedAt: Date;
        }
      - Хранение: Prisma (рекомендуется) или TypeORM.
   2) Пример Prisma schema (schema.prisma)
        model User {
          id        String  @id @default(cuid())
          username  String  @unique
          avatarUrl String?
          scores    Score[]
        }
        model Score {
          id          String   @id @default(cuid())
          user        User     @relation(fields: [userId], references: [id])
          userId      String
          type        ScoreType
          value       Int      @default(0)
          wins        Int?     @default(0)
          gamesPlayed Int?     @default(0)
          spent       Int?     @default(0)
          updatedAt   DateTime @updatedAt
          @@index([type, value], map: "score_type_value_idx")
        }
        enum ScoreType {
          games_total
          shop_points
        }

   3) NestJS слои (папки):
      - src/leaderboard/leaderboard.module.ts
      - src/leaderboard/leaderboard.controller.ts
      - src/leaderboard/leaderboard.service.ts
      - src/prisma/prisma.service.ts (если Prisma)
      - src/websocket/leaderboard.gateway.ts (опционально для live-обновлений)

   4) DTO и эндпоинты (REST):
      GET  /leaderboard?type=games_total|shop_points&limit=10&offset=0&sort=value:desc
      GET  /leaderboard/:userId/summary           // сводка по игроку
      PATCH/POST /leaderboard/:userId/score       // изменить/установить очки
      Пример DTO (TypeScript):
        export class GetLeaderboardDto {
          type: 'games_total' | 'shop_points';
          limit?: number;  // по умолчанию 10
          offset?: number; // пагинация
          sort?: string;   // формат: "value:desc"
        }
        export class UpsertScoreDto {
          type: 'games_total' | 'shop_points';
          delta?: number;         // инкремент
          set?: number;           // жесткая установка
          wins?: number;          // для игр
          gamesPlayed?: number;   // для игр
          spent?: number;         // для магазина
        }

   5) Сервис (псевдокод для Prisma):
        // leaderboard.service.ts (фрагмент)
        async list(dto: GetLeaderboardDto) {
          const [field, dir] = (dto.sort ?? 'value:desc').split(':');
          return this.prisma.score.findMany({
            where: { type: dto.type },
            orderBy: { [field]: dir === 'asc' ? 'asc' : 'desc' },
            take: dto.limit ?? 10,
            skip: dto.offset ?? 0,
            include: { user: true },
          });
        }
        async upsert(userId: string, dto: UpsertScoreDto) {
          const where = { userId_type: { userId, type: dto.type } };
          const existing = await this.prisma.score.findUnique({ where });
          const nextValue =
            dto.set ?? ((existing?.value ?? 0) + (dto.delta ?? 0));
          return this.prisma.score.upsert({
            where,
            create: { userId, type: dto.type, value: nextValue, wins: dto.wins, gamesPlayed: dto.gamesPlayed, spent: dto.spent },
            update: { value: nextValue, wins: dto.wins ?? existing?.wins, gamesPlayed: dto.gamesPlayed ?? existing?.gamesPlayed, spent: dto.spent ?? existing?.spent },
          });
        }

   6) Ответ бэка (формат для фронта)
      Для GET /leaderboard:
      {
        "type": "games_total" | "shop_points",
        "total": number, // опционально
        "items": [
          {
            "rank": number,
            "userId": string,
            "username": string,
            "avatarUrl": string | null,
            "gamesPlayed": number | null,
            "wins": number | null,
            "spent": number | null,
            "value": number
          }
        ]
      }

   7) Интеграция на фронте (минимум)
      - По клику на таб переключайте .isActive у кнопки и панели; у неактивной панели добавляйте hidden.
      - Делайте fetch('/leaderboard?type=games_total') и fetch('/leaderboard?type=shop_points').
      - Подставляйте значения в соответствующие ячейки; ранжируйте на бэке, чтобы не сортировать на клиенте.

   8) Реалтайм (опционально)
      - NestJS WebSocketGateway('leaderboard') => события 'scoreUpdated'.
      - На фронте подпишитесь и при приходе события обновляйте нужную строку.

   9) Безопасность и перфоманс
      - Включите CORS, rate limiting, кэш на GET (etag/max-age), пагинацию.
      - Индексы: (type, value desc), (userId, type).
      - Валидация DTO через class-validator / class-transformer.

   10) Деплой и миграции
      - Prisma: npx prisma migrate deploy
      - Переменные окружения: DATABASE_URL, ORIGIN(s), JWT_SECRET (если потребуется).
========================= */
