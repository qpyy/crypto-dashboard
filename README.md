# Crypto Simulator

![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-2ea44f?logo=github&logoColor=white)

Веб-приложение для симуляции торговли криптовалютой с визуализацией рынка, портфелем и статистикой операций.

Проект построен на React + TypeScript + Vite и ориентирован на понятный UX, адаптивность и расширяемую архитектуру.

## Возможности

- Рынок: загрузка цен и выбор актива.
- Торговля: покупка/продажа, long/short позиции, частичное закрытие.
- Портфель: текущая структура активов и динамика результата.
- Статистика: история операций и фильтрация по параметрам.
- Настройки: тема интерфейса и локальное сохранение состояния.
- Адаптивный интерфейс для desktop и mobile.

## Архитектура

- UI и страницы: `src/pages`, `src/components`
- Состояние приложения: `src/store` (Zustand)
- API слой: `src/api`
- Доменная логика расчетов: `src/domain/trading`

Бизнес-логика отделена от UI-слоя, поэтому проект удобно масштабировать и переносить расчеты на backend при необходимости.

## Быстрый старт (локально)

```bash
npm install
npm run dev
```

Приложение поднимется локально на Vite dev server.

## Переменные окружения

Создайте `.env`:

```bash
VITE_API_URL=https://api.coingecko.com/api/v3
```

Используемые эндпоинты:

- `/simple/price`
- `/coins/{id}/market_chart`

Подойдет любой API с совместимой схемой.

## Скрипты

```bash
npm run dev      # запуск в режиме разработки
npm run build    # production сборка
npm run preview  # локальный предпросмотр сборки
npm run typecheck # проверка TypeScript
npm run lint     # eslint
npm run lint:fix # автофикс ESLint
npm run format   # форматирование Prettier
npm run format:check # проверка форматирования
npm run deploy   # деплой на gh-pages
```

## Качество и история изменений

- История изменений: `CHANGELOG.md`
- Правила вклада: `CONTRIBUTING.md`
- Шаблон commit: `.gitmessage.txt`
- Код-стайл: Prettier (`.prettierrc`)
- Git hooks: Husky (`.husky/pre-commit`, `.husky/pre-push`)

`pre-commit`: форматирование/линт staged-файлов через `lint-staged`  
`pre-push`: `format:check` + `lint` + `typecheck`

Рекомендуется включить шаблон commit-сообщений:

```bash
git config commit.template .gitmessage.txt
```

Инициализация git-hooks:

```bash
npm run prepare
```

## Деплой на GitHub Pages

В `vite.config.ts` установлен `base: "/crypto-dashboard/"`.
Если репозиторий называется иначе, поменяйте `base`.

```bash
npm run build
npm run deploy
```

Используется `HashRouter`, поэтому маршруты работают корректно на GitHub Pages.

## Структура проекта (кратко)

```text
src/
  domain/         # доменная логика (trading engine)
  api/            # запросы к API
  components/     # UI компоненты
  constants/      # константы и конфиги
  helpers/        # утилиты
  hooks/          # кастомные хуки
  layout/         # общий layout
  pages/          # страницы
  store/          # Zustand сторы
  types/          # типы
```

## Лицензия

Все права защищены.
