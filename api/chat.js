/**
 * ============================================================================
 * VERCEL SERVERLESS FUNCTION: /api/chat
 * Secure server-side gateway to Google Gemini Generative Language API
 * with Trilingual (English + Hindi + Hinglish) and Token Efficiency handling.
 * ============================================================================
 */

const KNOWLEDGE = require('../chatbot-knowledge.js');

// Configurable constants
const DEFAULT_MODEL = 'gemini-2.5-flash';
const REQUEST_TIMEOUT_MS = 8000; // 8-second timeout as required
const MAX_MESSAGE_LENGTH = 300;
const MAX_HISTORY_MESSAGES = 4; // 4-message history limit
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;
const CACHE_TTL_MS = 3600000; // 1 hour

// In-memory rate limiting and cache stores
const ipRateLimitMap = new Map();
const inMemoryCache = new Map();

// Periodic cleanup of rate limiter & cache
function cleanupStores() {
  const now = Date.now();
  for (const [ip, record] of ipRateLimitMap.entries()) {
    if (now - record.resetTime > RATE_LIMIT_WINDOW_MS) {
      ipRateLimitMap.delete(ip);
    }
  }
  for (const [key, item] of inMemoryCache.entries()) {
    if (now - item.timestamp > CACHE_TTL_MS) {
      inMemoryCache.delete(key);
    }
  }
}

/**
 * Preliminary heuristics to intercept blatant prompt injections or off-topic spam
 * before calling Gemini, saving tokens and latency across English, Hindi, and Hinglish.
 */
function inspectQuickFilters(userText, detectedLang) {
  const lower = userText.toLowerCase().trim();

  // Multi-lingual injection patterns
  const injectionPatterns = [
    /ignore (all|any|previous|the above) (instructions|rules|prompts)/i,
    /reveal (your|the|system) (prompt|instructions|secret|api key)/i,
    /system instruction/i,
    /jailbreak/i,
    /\bDAN\b/i,
    /act as (an? unrestricted|a helpful assistant without rules|someone else)/i,
    /what are your instructions/i,
    /forget all rules/i,
    // Hindi & Hinglish injection patterns
    /नियम भूल जाओ/i,
    /सिस्टम प्रॉम्प्ट/i,
    /रूल्स भूल जाओ/i,
    /rules bhool jao/i,
    /system prompt batao/i,
    /as a different ai/i
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(lower)) {
      const refusal = KNOWLEDGE.I18N[detectedLang || 'en'].refusalMessage;
      return {
        blocked: true,
        reply: refusal
      };
    }
  }

  return { blocked: false };
}

module.exports = async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed. Use POST.',
      fallback: false
    });
  }

  // Rate Limiting Check
  const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown-ip')
    .toString()
    .split(',')[0]
    .trim();

  cleanupStores();
  const now = Date.now();
  let rateRecord = ipRateLimitMap.get(clientIp);

  if (!rateRecord || now > rateRecord.resetTime) {
    rateRecord = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
    ipRateLimitMap.set(clientIp, rateRecord);
  } else {
    rateRecord.count++;
    if (rateRecord.count > MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({
        error: 'Too many messages sent. Please wait a minute before asking again.',
        fallback: false
      });
    }
  }

  // Parse and validate incoming payload
  let { message, history, reply_lang, lang } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      error: 'Message is required and must be text.',
      fallback: false
    });
  }

  const sanitizedMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!sanitizedMessage) {
    return res.status(400).json({
      error: 'Message cannot be empty.',
      fallback: false
    });
  }

  // Determine language (priority: reply_lang -> lang -> detectLanguage)
  const detectedLang = reply_lang || lang || KNOWLEDGE.detectLanguage(sanitizedMessage);

  // Check In-Memory Cache with cache key: ${detectedLang}:${sanitizedQuery}
  const cacheKey = `${detectedLang}:${sanitizedMessage.toLowerCase()}`;
  const cachedEntry = inMemoryCache.get(cacheKey);
  if (cachedEntry && (now - cachedEntry.timestamp < CACHE_TTL_MS)) {
    return res.status(200).json({
      reply: cachedEntry.reply,
      isRefusal: cachedEntry.isRefusal || false,
      lang: detectedLang,
      cached: true,
      chips: cachedEntry.chips || null
    });
  }

  // Cheap preliminary safety / injection check
  const filterCheck = inspectQuickFilters(sanitizedMessage, detectedLang);
  if (filterCheck.blocked) {
    const chips = KNOWLEDGE.I18N[detectedLang].chips;
    // Store in cache
    inMemoryCache.set(cacheKey, {
      reply: filterCheck.reply,
      isRefusal: true,
      chips: chips,
      timestamp: now
    });

    return res.status(200).json({
      reply: filterCheck.reply,
      isRefusal: true,
      lang: detectedLang,
      chips: chips
    });
  }

  // Check API Key
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  const isKeyPlaceholder = !apiKey || apiKey === 'PASTE_YOUR_GEMINI_API_KEY_HERE';

  if (isKeyPlaceholder) {
    // Graceful fallback flag: signals the frontend to use local trilingual fallback
    return res.status(200).json({
      error: 'Gemini API key is not configured on the server.',
      fallback: true,
      lang: detectedLang
    });
  }

  const model = (process.env.GEMINI_MODEL || DEFAULT_MODEL).trim();

  // Prepare Gemini conversation contents (compact 4-message history)
  const contents = [];

  if (Array.isArray(history)) {
    const safeHistory = history.slice(-MAX_HISTORY_MESSAGES);
    for (const item of safeHistory) {
      if (item && item.text && typeof item.text === 'string') {
        const role = (item.role === 'model' || item.role === 'assistant') ? 'model' : 'user';
        contents.push({
          role: role,
          parts: [{ text: item.text.trim().slice(0, MAX_MESSAGE_LENGTH) }]
        });
      }
    }
  }

  // Append latest user message
  contents.push({
    role: 'user',
    parts: [{ text: sanitizedMessage }]
  });

  // Dynamic system prompt with targeted language directive
  const systemInstruction = KNOWLEDGE.buildSystemInstruction(detectedLang);

  // Token efficiency: about 250 for English, about 350 for Hindi and Hinglish
  const maxOutputTokens = detectedLang === 'en' ? 250 : 350;

  const requestBody = {
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: contents,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: maxOutputTokens
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      }
    ]
  };

  // Dispatch request to Google Gemini API with 8s AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(`Gemini API returned HTTP ${response.status}:`, errorText);

      return res.status(200).json({
        error: `Gemini API service temporarily unavailable (${response.status}).`,
        fallback: true,
        lang: detectedLang
      });
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];
    const generatedText = candidate?.content?.parts?.[0]?.text;

    if (!generatedText) {
      if (candidate?.finishReason === 'SAFETY') {
        const refusal = KNOWLEDGE.I18N[detectedLang].refusalMessage;
        return res.status(200).json({
          reply: refusal,
          isRefusal: true,
          lang: detectedLang,
          chips: KNOWLEDGE.I18N[detectedLang].chips
        });
      }

      return res.status(200).json({
        error: 'No response candidate returned from model.',
        fallback: true,
        lang: detectedLang
      });
    }

    const finalReply = generatedText.trim();

    // Cache the successful answer
    inMemoryCache.set(cacheKey, {
      reply: finalReply,
      isRefusal: false,
      timestamp: now
    });

    return res.status(200).json({
      reply: finalReply,
      fallback: false,
      lang: detectedLang
    });

  } catch (err) {
    clearTimeout(timeoutId);
    console.error('Gemini request error:', err?.message || err);

    return res.status(200).json({
      error: err.name === 'AbortError' ? 'Gemini request timed out.' : 'Failed to reach Gemini API.',
      fallback: true,
      lang: detectedLang
    });
  }
};
