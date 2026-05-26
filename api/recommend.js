export const config = { maxDuration: 30 };

const SYSTEM_PROMPT = `Du är en erfaren bokhandlare som rekommenderar böcker som present.
Välj verkliga, välkända böcker som faktiskt finns. Variera genre och stil.
Svara ENDAST med giltig JSON utan preamble eller markdown-formatering. Om inget annat anges, utgå från att mottagaren är en vuxen person bosatt i Sverige som pratar Svenska. Boken ska vara på svenska eller engelska.`;

function buildUserPrompt({ relation, giftType, age, budget, interests, occasion, freeText }) {
    const parts = [
        `Mottagaren: ${relation}${age ? `, ca ${age} år` : ""}.`,
        `Presentens syfte: ${giftType}.`,
        `Intressen: ${interests.join(", ")}.`,
        occasion && `Tillfälle: ${occasion}.`,
        budget ? `Budget: ${budget}.` : `Budget: ingen begränsning.`,
        freeText && freeText.trim() && freeText.trim(),
    ].filter(Boolean);

    return `${parts.join("\n")}

Ge exakt 4 bokrekommendationer i detta format:
{"books":[{"title":"...","author":"...","year":2019,"isbn":"...","reason":"..."}]}

Skriv reason på svenska. En mening. Förklara varför just denna person — inte boken generellt. Texten ska inte vara riktiad till den som ska få boken utan till den som ska köpa den. Var specifik utifrån mottagaren och relationen. Undvik generella fraser som "en bok för alla som gillar X". Var kreativ och personlig i dina rekommendationer!`;
}

async function fetchWithTimeout(url, ms = 4000) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), ms)
    try {
        const res = await fetch(url, { signal: controller.signal })
        clearTimeout(timer)
        return res
    } catch {
        clearTimeout(timer)
        return null
    }
}

async function fetchCover(title, author) {
    try {
        const q = encodeURIComponent(`intitle:${title} inauthor:${author}`)
        const res = await fetchWithTimeout(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1&fields=items(volumeInfo/imageLinks)`)
        if (res) {
            const data = await res.json()
            const thumb = data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail
            if (thumb) return thumb.replace('http:', 'https:')
        }
    } catch {}

    try {
        const q = `title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`
        const res = await fetchWithTimeout(`https://openlibrary.org/search.json?${q}&limit=1&fields=cover_i`)
        if (res) {
            const data = await res.json()
            const coverId = data?.docs?.[0]?.cover_i
            if (coverId) return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        }
    } catch {}

    return null
}

export default async function handler(req) {
    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: "API-nyckel saknas" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return new Response(JSON.stringify({ error: "Ogiltig förfrågan" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: buildUserPrompt(body) }],
        }),
    });

    if (!anthropicRes.ok) {
        const err = await anthropicRes.text();
        console.error("Anthropic error:", err);
        return new Response(JSON.stringify({ error: "Kunde inte hämta förslag" }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
        });
    }

    const anthropicData = await anthropicRes.json();
    const text = anthropicData.content?.[0]?.text ?? "";

    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch {
        console.error("JSON parse error, raw:", text);
        return new Response(JSON.stringify({ error: "Oväntat svar från AI" }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
        });
    }

    const books = await Promise.all(
        parsed.books.map(async book => ({
            ...book,
            coverUrl: await fetchCover(book.title, book.author),
        }))
    );

    return new Response(JSON.stringify({ books }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
