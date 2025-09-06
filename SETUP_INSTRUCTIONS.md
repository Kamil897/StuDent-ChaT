# Инструкции по настройке и запуску проекта

## 🚀 Быстрый запуск

1. **Запустите все сервисы одной командой:**
   ```bash
   start-all.bat
   ```

## 📋 Требования

- Node.js 18+ 
- MySQL 8.0+
- npm или yarn

## 🔧 Настройка базы данных

1. **Запустите MySQL через Docker:**
   ```bash
   docker-compose up -d db
   ```

2. **Создайте .env файлы:**

   **backend-login/.env:**
   ```env
   JWT_SECRET=your-super-secret-jwt-key-for-backend-login
   DATABASE_URL="mysql://root:root@localhost:3306/myapp"
   PORT=3000
   ```

   **backend-main/.env:**
   ```env
   JWT_SECRET=your-super-secret-jwt-key-for-backend-main
   DATABASE_URL="mysql://root:3306/myapp"
   PORT=7777
   ```

3. **Выполните миграции:**
   ```bash
   cd backend-login
   npm run prisma:generate
   npx prisma migrate deploy
   
   cd ../backend-main
   npm run prisma:generate
   npx prisma migrate deploy
   ```

## 🏃‍♂️ Ручной запуск сервисов

### Backend Login (порт 3000)
```bash
cd backend-login
npm install
npm run start:dev
```

### Backend Main (порт 7777)
```bash
cd backend-main
npm install
npm run start:dev
```

### Frontend (порт 5173)
```bash
cd frontend
npm install
npm run dev
```

### Admin Panel (порт 3001)
```bash
cd admin-panel
npm install
npm run dev
```

### Creator Panel (порт 3002)
```bash
cd creator-panel
npm install
npm run dev
```

## 🌐 Порты и URL

| Сервис | Порт | URL |
|--------|------|-----|
| Backend Login | 3000 | http://localhost:3000 |
| Backend Main | 7777 | http://localhost:7777 |
| Frontend | 5173 | http://localhost:5173 |
| Admin Panel | 3001 | http://localhost:3001 |
| Creator Panel | 3002 | http://localhost:3002 |

## 🔐 Роли пользователей

- **user** - может отправлять жалобы
- **admin** - может просматривать жалобы
- **superadmin** - может управлять AI сервером и просматривать жалобы

## 📝 API Endpoints

### Жалобы (backend-login:3000)
- `POST /reports` - создать жалобу
- `GET /reports` - получить все жалобы (admin+)
- `PATCH /reports/:id/review` - отметить как просмотренную (admin+)

### AI Статус (backend-main:7777)
- `GET /creator/ai-status` - получить статус AI (superadmin)
- `PATCH /creator/ai-status` - изменить статус AI (superadmin)

## 🐛 Устранение проблем

### Ошибка CORS
- Проверьте, что все сервисы запущены
- Убедитесь, что порты не заняты другими процессами

### Ошибка JWT
- Проверьте .env файлы с JWT_SECRET
- Убедитесь, что токен передается в заголовке Authorization

### Ошибка базы данных
- Проверьте, что MySQL запущен
- Убедитесь, что миграции выполнены
- Проверьте DATABASE_URL в .env файлах

## 📱 Тестирование

1. **Отправка жалобы:**
   - Откройте frontend (http://localhost:5173)
   - Нажмите кнопку жалобы (⚠️)
   - Заполните форму и отправьте

2. **Просмотр жалоб:**
   - Откройте admin-panel (http://localhost:3001)
   - Войдите как admin
   - Перейдите на страницу Reports

3. **Управление AI:**
   - Откройте creator-panel (http://localhost:3002)
   - Войдите как superadmin
   - Перейдите на страницу Server Status
   - Управляйте AI сервером

