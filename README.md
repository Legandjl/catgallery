# Cat Gallery

Single-page React app for uploading, browsing, favouriting, and voting on cat images via TheCatAPI.

## Prerequisites
- Node.js 18+ (tested with Node 20)
- TheCatAPI key

## Setup
1) Install deps:
```bash
npm install
```
2) Create `.env` at project root:
```bash
VITE_CAT_API_KEY=your-cat-api-key
```
3) Run the app:
```bash
npm start
```
The dev server prints the local URL (defaults to http://localhost:5173).

## Scripts
- `npm start` / `npm run dev` – Vite dev server with HMR
- `npm run build` – type-check + production build
- `npm run preview` – serve the production build locally
- `npm run lint` – ESLint
- `npm test` – Vitest unit tests

## Features
- Upload cats at `/upload` (drag/drop, validation, 5MB limit).
- View your uploads on `/` with favourite toggle, votes, and live score.
- Infinite scrolling explore feed at `/explore`.
- Favourites view at `/favourites`.

## API
- Uses https://api.thecatapi.com/v1 with `x-api-key` from `VITE_CAT_API_KEY`.
- `sub_id` set to `catgallery-dorian` for user-scoped votes/favourites.
