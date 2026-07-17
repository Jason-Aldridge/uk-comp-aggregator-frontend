# [OPEN] debug-fetch-cleanup

## Symptoms
- Во фронтенде подозреваются оставшиеся debug fetch-вызовы на `127.0.0.1:7777`.
- Backend может не отвечать на `localhost:3001`.

## Hypotheses
1. В `src/app/not-found.tsx` остался debug fetch.
2. В `src/components/layout/Footer.tsx` остался debug fetch.
3. Есть дополнительные `debug-point` следы в `src/`.
4. Backend на `localhost:3001` не запущен, поэтому `curl` возвращает `000`.

## Evidence
- Pending

## Next Step
- Проверить grep по `src/` и `curl` на backend.
