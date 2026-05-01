# Pomidorowa

Aplikacja Pomidorowa dla studentów i programistów, zaprojektowana w nowoczesnym stylu Bento Grid. Pozwala zarządzać zadaniami, uruchamiać 25-minutowe sesje fokusowe i śledzić dzienny postęp pracy w minimalistycznym, wysokokontrastowym interfejsie.

## Funkcje

- Rejestracja i logowanie (JWT)
- Dodawanie, edycja i usuwanie zadań
- Timer Pomodoro — 25 min pracy / 5 min przerwy z sygnałem dźwiękowym
- Automatyczny zapis ukończonych sesji do bazy danych
- Dzienny dashboard ze statystykami (łączny czas, liczba pomidorów per zadanie)

## Stack

| Warstwa     | Technologia                     |
|-------------|---------------------------------|
| Frontend    | Angular 21, Tailwind CSS v4     |
| UI Style    | Bento Grid (OLED Dark Mode)     |
| Backend     | Node.js, Express.js, TypeScript |
| Baza danych | PostgreSQL, Prisma ORM          |
| Auth        | JWT, bcrypt                     |

## Proponowana struktura projektu

```
pomodoro/
├── backend/
│   ├── prisma/           # Schema bazy danych
│   └── src/
│       ├── routes/       # auth.ts, tasks.ts, sessions.ts
│       └── middleware/   # auth.ts (weryfikacja JWT)
└── frontend/
    └── src/app/
        ├── auth/         # Strona logowania i rejestracji
        ├── dashboard/    # Timer + lista zadań
        ├── stats/        # Statystyki dnia
        └── core/         # Serwisy, modele, interceptory
```

## Uruchomienie

### Docker (Najprostsza metoda)
Skopiuj i uzupełnij zmienne środowiskowe.
```bash
cp .env-example .env
```

Uruchomienie. Zaleca się używanie flagi **--build**, aby obrazy zawsze zawierały najnowsze zmiany.
```bash
docker compose up --build -d
```


## Proponowane API

| Metoda | Endpoint               | Opis                           | Auth |
|--------|------------------------|--------------------------------|------|
| POST   | /api/auth/register     | Rejestracja                    | —    |
| POST   | /api/auth/login        | Logowanie, zwraca JWT          | —    |
| GET    | /api/tasks             | Lista zadań użytkownika        | ✓    |
| POST   | /api/tasks             | Dodaj zadanie                  | ✓    |
| PUT    | /api/tasks/:id         | Edytuj zadanie                 | ✓    |
| DELETE | /api/tasks/:id         | Usuń zadanie                   | ✓    |
| POST   | /api/sessions          | Zapisz sesję (tylko pełne 25min) | ✓  |
| GET    | /api/sessions/today    | Statystyki z dzisiaj           | ✓    |

## Schemat bazy danych

```
users    — id, email, password_hash, created_at
tasks    — id, user_id, name, is_active, created_at
sessions — id, user_id, task_id, task_name, duration_seconds, completed_at
```

