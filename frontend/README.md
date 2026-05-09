# Pomidorowa - Frontend

Nowoczesny, responsywny interfejs użytkownika dla aplikacji Pomidorowa, zbudowany w oparciu o Angular 21 i Tailwind CSS v4.

## Cechy interfejsu
- **Bento Grid Design**: Estetyczny układ kaflowy inspirowany nowoczesnymi trendami UI.
- **OLED Dark Mode**: Wysokokontrastowy tryb ciemny z akcentami w kolorze Slate i Rose.
- **Micro-interactions**: Płynne przejścia i animacje (fade-in, float) za pomocą Tailwind CSS.
- **Signals-based Reactivity**: Wykorzystanie Angular Signals do zarządzania stanem timera i zadań w czasie rzeczywistym.

## Technologie
- **Framework**: Angular 21 (Standalone Components)
- **Styling**: Tailwind CSS v4
- **Komunikacja**: HttpClient z Auth Interceptorem (JWT)
- **Ikony/Grafika**: Emojis & Custom CSS

## Struktura katalogów
- `src/app/auth`: Logowanie i rejestracja z dynamicznym przełączaniem tabów.
- `src/app/dashboard`: Dashboard z timerem i listą zadań (Bento layout).
- `src/app/core/services`:
  - `AuthService`: Zarządzanie sesją i JWT.
  - `TimerService`: Logika odliczania czasu i sygnałów dźwiękowych.
  - `TaskService` & `SessionService`: Komunikacja z API backendowym.
- `src/app/core/guards`: Strażnicy tras (`authGuard`, `guestGuard`).

## Uruchomienie lokalne
1. Upewnij się, że masz zainstalowane [Node.js](https://nodejs.org/).
2. Wejdź do katalogu: `cd frontend`
3. Zainstaluj zależności: `npm install`
4. Uruchom aplikację: `npm start`
5. Otwórz `http://localhost:4200`

## Budowanie produkcyjne
```bash
npm run build
```
Obraz Dockerowy automatycznie wykonuje ten krok i serwuje pliki za pomocą Nginx.
