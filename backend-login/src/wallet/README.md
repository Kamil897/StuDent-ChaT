# Система Кошелька

## Описание
Система кошелька управляет виртуальной валютой пользователей: монетами, кристаллами и очками кармы.

## Модели данных

### User (дополнительные поля)
- `coins` - количество монет
- `crystals` - количество кристаллов
- `karmaPoints` - очки кармы

### WalletTransaction
- `id` - уникальный идентификатор
- `userId` - ID пользователя
- `type` - тип: "deposit", "withdraw", "transfer", "reward"
- `amount` - сумма
- `currency` - валюта: "coins", "crystals", "points"
- `source` - источник транзакции
- `createdAt` - дата транзакции

## API Endpoints

### GET /wallet/balance
Получить баланс пользователя

### POST /wallet/add
Пополнить баланс
```json
{
  "amount": 100,
  "currency": "coins",
  "source": "game_reward"
}
```

### POST /wallet/spend
Потратить валюту
```json
{
  "amount": 50,
  "currency": "crystals",
  "source": "shop_purchase"
}
```

### POST /wallet/transfer
Перевести валюту другу
```json
{
  "toUserId": 123,
  "amount": 25,
  "currency": "coins"
}
```

### GET /wallet/transactions
Получить историю транзакций

### GET /wallet/stats
Получить статистику транзакций

## Типы валют

### Монеты (🪙)
- Основная игровая валюта
- Зарабатываются в играх
- Тратятся в магазине

### Кристаллы (💎)
- Премиум валюта
- Покупаются за реальные деньги
- Используются для премиум функций

### Очки кармы (🌟)
- Награды за достижения
- Социальные действия
- Не тратятся, только накапливаются

## Типы транзакций

- **deposit** - пополнение баланса
- **withdraw** - списание средств
- **transfer** - перевод между пользователями
- **reward** - награда за достижения

## Интеграция с играми

```typescript
// Награда за игру
await walletService.addCoins(userId, score / 10, 'game_reward');

// Покупка в игре
await walletService.spendCoins(userId, itemPrice, 'game_purchase');
```

## Интеграция с достижениями

```typescript
// Награда за достижение
await walletService.addCoins(userId, achievement.points, 'achievement_reward');
```

## Интеграция с магазином

```typescript
// Покупка в магазине
await walletService.spendCrystals(userId, product.price, 'shop_purchase');

// Донат
await walletService.addCrystals(userId, donation.amount, 'donation');
```

## Безопасность

- Все транзакции логируются
- Проверка баланса перед списанием
- Защита от отрицательного баланса
- Валидация входных данных
- Атомарные операции через транзакции БД

## Примеры использования

### Игрок выиграл игру
```typescript
const score = 1500;
const coinsEarned = Math.floor(score / 10); // 150 монет
await walletService.addCoins(userId, coinsEarned, 'snake_game');
```

### Покупка в магазине
```typescript
const product = { price: 100, currency: 'crystals' };
await walletService.spendCrystals(userId, product.price, 'shop_purchase');
```

### Награда за достижение
```typescript
const achievement = { points: 50 };
await walletService.addCoins(userId, achievement.points, 'achievement_unlocked');
```




