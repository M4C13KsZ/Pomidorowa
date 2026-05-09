# Pomidorowa

Aplikacja Pomidorowa dla studentów i programistów, zaprojektowana w nowoczesnym stylu Bento Grid. Pozwala zarządzać zadaniami, uruchamiać 25-minutowe sesje fokusowe i śledzić dzienny postęp pracy w minimalistycznym, wysokokontrastowym interfejsie.

## Status Projektu

- [x] Konfiguracja bazy danych (PostgreSQL + Prisma)
- [x] Backend API (Auth, Tasks, Sessions)
- [x] Frontend (Angular + Tailwind v4 + Bento Grid)
- [x] Pełna konteneryzacja (Docker + Docker Compose)
- [x] Obsługa błędów autoryzacji (401) i walidacja formularzy

## Stack Technologiczny

| Warstwa     | Technologia                     |
|-------------|---------------------------------|
| **Frontend**| Angular 21, Signals, Tailwind 4 |
| **Backend** | Node.js, Express, TypeScript    |
| **Baza**    | PostgreSQL, Prisma ORM          |
| **DevOps**  | Docker, Docker Compose, Nginx   |

## Szybki Start (Docker)

1. Skonfiguruj środowisko:
   ```bash
   cp .env-example .env
   ```
2. Uruchom cały stos:
   ```bash
   docker compose up --build -d
   ```
   Aplikacja będzie dostępna pod adresem: `http://localhost:8080`

## Rozwój Lokalny (bez Dockera)

### Backend
1. `cd backend`
2. `npm install`
3. `npx prisma db push`
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start` (dostępny pod `http://localhost:4200`)

---

## API Endpoints

| Metoda | Endpoint               | Opis                            | Auth |
|--------|------------------------|---------------------------------|------|
| POST   | `/api/auth/register`   | Rejestracja                     | —    |
| POST   | `/api/auth/login`      | Logowanie (zwraca JWT)          | —    |
| GET    | `/api/tasks`           | Lista zadań użytkownika         | ✓    |
| POST   | `/api/sessions`        | Zapisz sesję (pełne 25 min)     | ✓    |
| GET    | `/api/sessions/today`  | Statystyki z dzisiaj            | ✓    |

## Schemat bazy danych

```
users    — id, email, passwordHash, createdAt
tasks    — id, userId, name, isActive, createdAt
sessions — id, userId, taskId, taskName, durationSeconds, completedAt
```
