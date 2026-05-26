# Bokpresent — produktspecifikation

## Koncept

Bokpresent är en webb-app som hjälper användare att hitta rätt bok som present till en specifik person. Användaren beskriver mottagaren via ett kort formulär; appen returnerar 4 konkreta bokförslag med motivering och direktlänkar till svenska bokhandlare.

Kärnlöftet: från formulär till köpklart förslag på under 30 sekunder, utan registrering.

---

## Målgrupp

Primär: vuxna som ska köpa en present och inte vet vilken bok. Tillfällena är födelsedag, jul, student och spontana gåvor. Köpbeslutet sker ofta inom 24–48 timmar från söktillfället.

Sekundär: personer som köper böcker regelbundet och vill ha inspiration utanför sin egna bubbla.

---

## Flöde

### Vy 1 — Startsida

**Syfte:** Kommunicera värdet, eliminera tveksamhet, ta användaren vidare till formuläret.

**Innehåll:**
- Produktnamn + tagline: *"Rätt bok. Till rätt person."*
- En primär CTA-knapp: "Hitta en bok"
- Tre-stegsförklaring: Beskriv personen → AI väljer böcker → Köp direkt
- Trustsignaler under stegsförklaringen: "Ingen registrering", "Inget sparas", "30 sekunder"

**Designprincip:** Ingen förklaring av hur tekniken fungerar. Fokus på utfallet.

---

### Vy 2 — Formulär

**Syfte:** Samla tillräcklig information för en träffsäker rekommendation. Hög konvertering prioriteras — varje fält som är onödigt tar bort det.

**Progressindikator:** 4 steg visas som en tunn linje längst upp. Indikerar att man är på väg mot ett mål.

**Fält:**

| Fält | Typ | Obligatoriskt |
|---|---|---|
| Relation | Chips (välj en): Partner, Förälder, Vän, Kollega, Syskon, Barn | Ja |
| Presenttyp | Chips (välj en): Omtänksam, Imponerande, Rolig, Praktisk, Samtalsstartare | Ja |
| Ålder | Siffra, fritext | Nej |
| Budget | Dropdown: Under 150 kr / 150–300 kr / 300–500 kr / 500+ kr | Ja |
| Intressen | Chips (välj flera): Historia, Psykologi, Thriller, Filosofi, Humor, Biografi, Natur, Ekonomi, Skönlitteratur, Sport | Ja (minst ett) |
| Tillfälle | Dropdown: Födelsedag, Jul, Student, Bara så, Annat | Nej |
| Fritext | Textarea, valfri | Nej |

**Valideringsbeteende:** Felmeddelande visas inline under knappen, inte som popup. Inga fält markeras rött förrän användaren försökt skicka.

**Knapp:** "Hitta böcker" — full bredd, primärfärg.

---

### Vy 3 — Resultat

**Syfte:** Presentera 4 bokförslag på ett sätt som driver köpbeslut.

**Innehåll överst:**
- Rubrik: "4 böcker för din [relation]"
- Undertitel: Sammanfattning av sökkriterierna (relation + presenttyp + intressen) — bekräftar att AI förstått

**Bokkortet (upprepas 4 gånger):**
- Omslag (placeholder-ikon i MVP, Google Books API-bild i v1)
- Titel + författare + utgivningsår
- Motivering: 1–2 meningar om *varför just den här personen* skulle uppskatta boken
- Köpknappar: Bokus | Adlibris (söklänkar baserade på titel + författare)

**Under bokförslagen:**
- "Sök igen" — återställer formuläret
- "Dela listan" — genererar en permanent URL till samma resultat (valfri i MVP)

**Aggregerad statistik (valfri i MVP):**
- Totalt antal rekommendationer gjorda
- Antal unika titlar
- Presenteras utan relation till den individuella sökningen

---

## Relation och presenttyp — hur de påverkar resultatet

### Relation

Relationen styr intimitetsnivån på rekommendationen och vilken typ av bok som är socialt lämplig.

| Relation | Styrning |
|---|---|
| Partner | Mer sårbar och nischad. Böcker som signalerar att givaren känner personen väl. |
| Förälder | Mognad och tyngd. Livserfarenhet, historia, eftertanke. |
| Vän | Bred spridning. Lite mer experimentellt. Kan vara okänd titel. |
| Kollega | Socialt neutral. Populärvetenskap, humor, välkänd biografi. Inget för personligt. |
| Syskon | Nostalgi och igenkänning möjlig. Kan vara lekfullare. |
| Barn | Ålder styr helt. Under 12: annat flöde. 12–18: ungdomslit eller vuxen entré. |

### Presenttyp

Presenttypen är den viktigaste dimensionen för att träffa rätt. Den styr vad presenten ska kommunicera snarare än vad personen råkar tycka om.

| Presenttyp | Styrning |
|---|---|
| Omtänksam | Nischad och personlig. Gärna okänd titel. Hög emotionell träffbild. |
| Imponerande | Välkänd, tung, lite utmanande. Sapiens, Kahneman, Frankl. |
| Rolig | Humor, kortare, låg ansträngning. Adams, Sedaris, Poehler. |
| Praktisk | Facklitteratur inom intresset. Självhjälp utan att vara självhjälp. |
| Samtalsstartare | Kontroversiell eller aktuell. Något med en tydlig tes att reagera på. |

### Kombinationslogiken

Kombinationen av relation och presenttyp är mer träffsäker än intressen ensamt:

- Kollega + Imponerande → Thinking Fast and Slow, Sapiens
- Kollega + Rolig → Hitchhiker's Guide, Yes Please
- Partner + Omtänksam + Filosofi → smalare, oväntat val — inte Marcus Aurelius som alla har
- Förälder + Praktisk + Historia → välkänd, välrekommenderad, på svenska om möjligt

---

## Prompt-arkitektur

Prompten till Claude byggs dynamiskt från formulärdata och skickas via backend.

**Systeminstruktion (fast):**
```
Du är en erfaren bokhandlare som rekommenderar böcker som present.
Välj verkliga, välkända böcker som faktiskt finns. Variera genre och stil.
Svara ENDAST med giltig JSON utan preamble eller markdown-formatering.
```

**Användarinstruktion (dynamisk):**
```
Mottagaren: [relation], ca [ålder] år, [läsvana].
Presentens syfte: [presenttyp].
Intressen: [kommaseparerad lista].
Tillfälle: [tillfälle].
Budget: [budget].
[Fritext om finns]

Ge exakt 4 bokrekommendationer i detta format:
{"books":[{"title":"...","author":"...","year":2019,"isbn":"...","reason":"..."}]}

Skriv reason på svenska. En mening. Förklara varför just denna person — inte boken generellt.
```

**Validering efter svar:**
- Verifiera ISBN via Google Books API innan rendering
- Om boken inte hittas: ta nästa förslag från Claude eller visa utan omslag

---

## Teknisk stack

| Del | Val | Motivering |
|---|---|---|
| Frontend | React + Vite | Bekant stack. Snabb iteration. |
| Styling | Tailwind CSS | Utility-first, inga CSS-filer att hantera. |
| Backend | Vercel Edge Functions | Proxar API-nyckel. Ingen server att underhålla. |
| AI | Claude API (claude-sonnet-4-5) | Bäst på strukturerad output och nyanserade rekommendationer. |
| Bokdata | Google Books API | Omslag, ISBN-validering, metadata. Gratis. |
| Hosting | Vercel | Gratis tier räcker länge. |
| Databas | Ingen i MVP | Aggregerad statistik läggs till i fas 2 med Supabase. |

---

## Kostnad per slagning

| Komponent | Tokens (ca) | Kostnad |
|---|---|---|
| Input-prompt | 350 | $0,001 |
| Output (4 bokförslag JSON) | 300 | $0,005 |
| Totalt | 650 | ~$0,006 |

Vid 10 000 slagningar/månad: ~$6. Försumbart tills produkten har trafik.

---

## Vad som inte ingår i MVP

- Användarinloggning och sparad historik
- Omslag via Google Books API (placeholder-ikoner i MVP)
- Dela-länk med permanent URL
- Aggregerad statistik
- Barnflöde (under 12 år)
- Engelska böcker kontra svenska — MVP returnerar vad Claude väljer

---

## Fas 2 — efter MVP

1. Google Books API-integration för riktiga omslag
2. Dela-funktion med unik URL per sökning
3. Aggregerad statistik (Supabase, anonymiserad)
4. Presenttyp-dimensionen förbättras med fler alternativ
5. SEO-landningssidor per tillfälle: "Bästa boken i julklapp till förälder"

---

## Namnförslag

- bokpresent.se
- bokgåva.se
- rättbok.se
- boken.till — experimentellt

---

*Dokument: version 1.0 — maj 2026*
