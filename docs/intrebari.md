# Întrebările cititorilor

## Cum funcționează
1. Pe fiecare pagină de analiză, secțiunea „Întrebări despre raționament” (componenta `AskBox`) permite autentificarea cu un link trimis pe email (Firebase Auth, „Email link”), care verifică adresa.
2. Întrebarea se salvează în Firestore, colecția `questions` (regulile sunt în `firestore.rules`).
3. Vinerea, workflow-ul `qa.yml` exportă întrebările fără răspuns în depozitul PRIVAT de întrebări (`pending.json`). Adresele de email nu ajung niciodată în depozitul public.
4. Sarcina săptămânală Claude citește `pending.json`, pregătește răspunsurile (RO și EN, cu surse din analize) și le trimite lui Daniel spre aprobare.
5. După aprobare, răspunsurile se scriu în `answers.json` (depozitul privat), se pornește `qa.yml`, care le publică: în contul cititorului și, dacă a fost de acord, public, în `qa_public`. Răspunsul se trimite și pe email, din Gmail, după aprobare.

## `answers.json`
```json
[{ "id": "<id-ul întrebării>", "approved": true, "question": { "ro": "…", "en": "…" }, "answer": { "ro": "…", "en": "…" } }]
```

## Configurare (o singură dată)
- `src/data/firebase-config.json`: configurația publică a aplicației web. Cât timp e goală, secțiunea nu apare.
- Secretul `FIREBASE_SERVICE_ACCOUNT` (cheia contului de serviciu), secretul `QA_INBOX_TOKEN` (token cu drept de scriere pe depozitul privat) și variabila `QA_INBOX_REPO` (de exemplu `TatisiAdrian/radar-intrebari`).
