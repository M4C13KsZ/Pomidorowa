# FocusTrack — Frontend

Aplikacja Angular 21 z Tailwind CSS v4.

## Uruchomienie

```bash
npm install
npm start   # ng serve na http://localhost:4200
```

## Build

```bash
npm run build   # artefakty w dist/frontend/
```

## Proponowana struktura

```
src/app/
├── auth/          # Logowanie / Rejestracja
├── dashboard/     # Timer + lista zadań
├── stats/         # Statystyki dnia
└── core/
    ├── models/    # Interfejsy TypeScript
    ├── services/  # AuthService, TaskService, SessionService, TimerService
    └── guards/    # authGuard, guestGuard
```
