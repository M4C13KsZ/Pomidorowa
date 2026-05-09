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

## Authentication API

### Endpoints

#### `POST /api/auth/register`
Rejestracja nowego użytkownika.

**Funkcje:**
- walidacja emaila i hasła,
- sprawdzanie duplikatów użytkowników,
- hashowanie hasła (`bcrypt`),
- generowanie tokenu JWT.

#### `POST /api/auth/login	`
Logowanie użytkownika.

**Funkcje:**
- weryfikacja danych logowania,
- porównanie hasła z hashem,
- generowanie tokenu JWT,
- zwracanie danych użytkownika.

---

## Główne cechy

- Express + TypeScript
- Prisma ORM
- JWT Authentication
- Hashowanie haseł (`bcryptjs`)
- Obsługa błędów HTTP
- Walidacja danych wejściowych
- Bezpieczne przechowywanie haseł

## Sessions API

#### `POST api/sessions`
Zapisywanie ukończonej sesji Pomodoro.

**Funkcje:**
- wymaga autoryzacji JWT,
- zapisuje tylko pełne sesje 25 minut (`1500s`),
- walidacja nazwy zadania,
- zapis sesji użytkownika w bazie danych.

---

#### `GET api/sessions/today`
Pobieranie dzisiejszych sesji użytkownika.

**Funkcje:**
- wymaga autoryzacji JWT,
- pobiera sesje z bieżącego dnia,
- oblicza łączny czas pracy,
- zwraca liczbę ukończonych Pomodoro,
- generuje podsumowanie według zadań.

---

## Główne cechy

- JWT Authentication Middleware
- Prisma ORM
- Statystyki produktywności
- Obsługa sesji Pomodoro
- Walidacja danych wejściowych
- Obsługa błędów HTTP

## Schemat bazy danych

```
users    — id, email, passwordHash, createdAt
tasks    — id, userId, name, isActive, createdAt
sessions — id, userId, taskId, taskName, durationSeconds, completedAt
```
