# Bokpresent

Webb-app som hjälper användare hitta rätt bok som present. Användaren fyller i ett kort formulär om mottagaren; appen returnerar 4 konkreta bokförslag med motivering och köplänkar till svenska bokhandlare.

## Tech stack

| Del | Val |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend | Vercel Edge Functions |
| AI | Claude API (claude-sonnet-4-6) |
| Bokdata | Google Books API (omslag + metadata) |
| Hosting | Vercel |
| Databas | Ingen i MVP |

## Tre vyer

- **Vy 1 – Landing:** Tagline, CTA-knapp, tre-stegsförklaring, trustsignaler
- **Vy 2 – Formulär:** Relation (chips), Presenttyp (chips), Ålder (fritext), Budget (dropdown), Intressen (chips, flerval), Tillfälle (dropdown), Fritext (textarea)
- **Vy 3 – Resultat:** 4 bokkort med omslag, titel, författare, motivering, köplänkar till Bokus och Adlibris

## Scope-beslut (MVP)

- Bokomslag: Google Books API direkt (inte placeholder)
- Statistik: hårdkodade dummy-siffror nu, riktig data i fas 2
- Dela-listan: skippad i MVP
- Budget-fält: dropdown (inte fritext)
- Barnflöde (under 12 år): ej implementerat

## Byggordning

1. Scaffolda React + Vite + Tailwind
2. Vy 1 — Landing page
3. Vy 2 — Formulär med validering
4. Vercel Edge Function med mock-svar (redo för riktig nyckel)
5. Google Books API-integration för omslag
6. Vy 3 — Resultatsida
7. Köplänkar Bokus/Adlibris
8. Laddningsstate, felhantering, mobilanpassning
9. Deploy till Vercel

## Status

- [ ] Projekt scaffoldat
- [ ] Vy 1 klar
- [ ] Vy 2 klar
- [ ] Edge Function uppsatt (mock)
- [ ] Google Books API kopplat
- [ ] Vy 3 klar
- [ ] Deploy

## Pending

- **Claude API-nyckel:** saknas tills vidare — Edge Function byggs med mock-svar och byter till riktig nyckel via env-variabel när den finns
- **Google Books API-nyckel:** gratis via Google Cloud Console, behövs innan deploy
- **Vercel-konto:** behövs inför deploy

## Formfält och valideringsregler

| Fält | Typ | Obligatoriskt |
|---|---|---|
| Relation | Chips (välj en) | Ja |
| Presenttyp | Chips (välj en) | Ja |
| Ålder | Fritext (siffra) | Nej |
| Budget | Dropdown | Ja |
| Intressen | Chips (välj minst ett) | Ja |
| Tillfälle | Dropdown | Nej |
| Fritext | Textarea | Nej |

Felmeddelanden visas inline under knappen. Inga fält markeras rött förrän användaren försökt skicka.

## Prompt-arkitektur (Claude)

Systeminstruktion är fast. Användarinstruktion byggs dynamiskt från formulärdata. Svar ska vara giltig JSON utan preamble:

```json
{"books":[{"title":"...","author":"...","year":2019,"isbn":"...","reason":"..."}]}
```

`reason` skrivs på svenska, en mening, förklarar varför just denna person — inte boken generellt.

## Köplänkar

Söklänkar baserade på titel + författare:
- Bokus: `https://www.bokus.com/cgi-bin/product_search.cgi?search_word={titel}+{författare}`
- Adlibris: `https://www.adlibris.com/se/sok?search={titel}+{författare}`

## Specifikation

Full produktspec finns i `bokpresent-produktspec_2.md`.
