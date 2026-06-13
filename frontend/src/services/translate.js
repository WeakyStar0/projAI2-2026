const memCache = new Map();

const cacheKey = (text, to) => `${to}:${text}`;

function fromStorage(key) {
  try { return sessionStorage.getItem(key); } catch { return null; }
}

function toStorage(key, value) {
  try { sessionStorage.setItem(key, value); } catch {}
}

export async function translateText(text, toLang) {
  if (!text || !text.trim()) return text;

  const targetCode = toLang === 'pt' ? 'pt-PT' : 'en-GB';
  const key = cacheKey(text, targetCode);

  if (memCache.has(key)) return memCache.get(key);
  const stored = fromStorage(key);
  if (stored) { memCache.set(key, stored); return stored; }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=autodetect|${targetCode}`;
    const res = await fetch(url);
    const data = await res.json();
    const result = data.responseData?.translatedText || text;
    memCache.set(key, result);
    toStorage(key, result);
    return result;
  } catch {
    return text;
  }
}

export async function translateItems(items, toLang, fields = ['name', 'description']) {
  return Promise.all(
    items.map(async (item) => {
      const translated = { ...item };
      for (const field of fields) {
        if (item[field]) {
          translated[field] = await translateText(item[field], toLang);
        }
      }
      return translated;
    })
  );
}
