/**
 * Deep Internalizer - AI Chunking Service
 * Integrates with local Ollama API for semantic text chunking
 */

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const DEFAULT_MODEL = 'llama3.1:latest';

// System prompt for semantic chunking
const CHUNKING_SYSTEM_PROMPT = `You are a reading comprehension assistant specializing in English text analysis.
Your task is to divide the given text into logical thematic chunks for deep reading.

For each chunk, provide:
1. A short title (3-5 words, captures the main idea)
2. A 2-sentence summary in English
3. A 1-sentence summary in Chinese (summary_zh)
4. The exact start and end sentence indices (0-indexed)

Output ONLY valid JSON array, no other text:
[
  {
    "title": "The Problem Statement",
    "summary": "The author introduces the core challenge. They argue that current approaches fall short.",
    "summary_zh": "作者介绍了核心挑战，并认为现有方法存在不足。",
    "startIndex": 0,
    "endIndex": 4
  }
]

Rules:
- Each chunk should contain 3-8 sentences for optimal learning
- Chunks must follow the logical flow of the argument
- Identify transitions between ideas as natural chunk boundaries
- Do not overlap chunks`;

// System prompt for keyword extraction
const KEYWORD_EXTRACTION_PROMPT = `You are a vocabulary extraction assistant for English learners.
Extract 5-8 key vocabulary words from this paragraph.

For each word provide:
- word: the word itself
- phonetic: IPA transcription (use full word transcription)
- pos: part of speech (e.g., n., v., adj., adv., phr.)
- slices: split the word into logical syllable blocks. Output as an array of tuples: [["text", "ipa"], ...].
    - text: the character slice
    - ipa: the IPA transcription for JUST that slice
- definition: brief definition in English (20 words max)
- definition_zh: brief definition in Chinese (7 words max)
- newContext: a NEW example sentence using the word (different from the original sentence), preferably from a real-world context.

Output ONLY valid JSON array:
[
  {
    "word": "aggregate",
    "phonetic": "/ˈæɡrɪɡeɪt/",
    "pos": "v.",
    "slices": [
      ["ag", "ˈæɡ"],
      ["gre", "rɪ"],
      ["gate", "ɡeɪt"]
    ],
    "definition": "to collect or gather into a whole",
    "definition_zh": "集合；合计",
    "newContext": "We need to aggregate the data from multiple sources to get a clear picture."
  }
]

Prioritize:
1. Domain-specific or technical terms
2. Advanced vocabulary (CEFR B2+)
3. Words crucial to understanding the argument
4. Skip common words (the, is, have, etc.)`;

/**
 * Tokenize text into sentences
 */
function tokenizeSentences(text) {
    // Simple sentence tokenization (can be improved)
    const sentences = text
        .replace(/([.!?])\s+/g, '$1|')
        .split('|')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    return sentences;
}

/**
 * Call Ollama API with optional AbortController support
 * @param {string} prompt - The prompt to send
 * @param {string} model - The model to use
 * @param {AbortSignal} signal - Optional AbortSignal for cancellation
 */
async function callOllama(prompt, model = DEFAULT_MODEL, signal = null) {
    try {
        const fetchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model,
                prompt,
                stream: false,
                options: {
                    temperature: 0.3, // Lower for more consistent output
                    num_predict: 2048
                }
            })
        };

        // Attach signal if provided for request cancellation
        if (signal) {
            fetchOptions.signal = signal;
        }

        const response = await fetch(OLLAMA_API_URL, fetchOptions);

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        // Handle AbortError gracefully
        if (error.name === 'AbortError') {
            console.log('[Ollama] Request was cancelled');
            throw error; // Re-throw for caller to handle
        }
        console.error('Ollama API call failed:', error);
        throw error;
    }
}

/**
 * Parse JSON from LLM response (handles markdown code blocks)
 */
function parseJsonResponse(response) {
    // Remove markdown code blocks if present
    let cleaned = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

    // Find JSON array boundaries
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');

    if (start === -1 || end === -1) {
        throw new Error('No valid JSON array found in response');
    }

    cleaned = cleaned.substring(start, end + 1);
    return JSON.parse(cleaned);
}

/**
 * Chunk a document into semantic segments
 * @param {string} text - The text to chunk
 * @param {string} model - The model to use
 * @param {AbortSignal} signal - Optional AbortSignal for cancellation
 */
export async function chunkDocument(text, model = DEFAULT_MODEL, signal = null) {
    const sentences = tokenizeSentences(text);

    if (sentences.length === 0) {
        throw new Error('No sentences found in text');
    }

    // For very short texts, return as single chunk
    if (sentences.length <= 5) {
        return [{
            title: 'Complete Text',
            summary: sentences.slice(0, 2).join(' '),
            startIndex: 0,
            endIndex: sentences.length - 1,
            originalText: text
        }];
    }

    const prompt = `${CHUNKING_SYSTEM_PROMPT}

Text to analyze (${sentences.length} sentences):
${text}`;

    const response = await callOllama(prompt, model, signal);
    const chunks = parseJsonResponse(response);

    // Enrich chunks with original text
    return chunks.map(chunk => ({
        ...chunk,
        originalText: sentences
            .slice(chunk.startIndex, chunk.endIndex + 1)
            .join(' ')
    }));
}

/**
 * Extract keywords from a chunk
 * @param {string} chunkText - The text to extract keywords from
 * @param {string} model - The model to use
 * @param {AbortSignal} signal - Optional AbortSignal for cancellation
 */
export async function extractKeywords(chunkText, model = DEFAULT_MODEL, signal = null) {
    const prompt = `${KEYWORD_EXTRACTION_PROMPT}

Paragraph:
${chunkText}`;

    const response = await callOllama(prompt, model, signal);
    const rawKeywords = parseJsonResponse(response);

    // Post-process: Transform tuple slices and fill sentence
    const sentences = tokenizeSentences(chunkText);

    return rawKeywords.map(word => {
        // 1. Transform Slices: [["ag", "ipa"]] -> [{text: "ag", phonetic: "ipa"}]
        if (Array.isArray(word.slices) && Array.isArray(word.slices[0])) {
            word.slices = word.slices.map(tuple => ({
                text: tuple[0],
                phonetic: tuple[1] || '' // Allow empty if missing
            }));
        }

        // 2. Find Sentence
        if (!word.sentence) {
            // Simple robust matching: find first sentence containing the word (case-insensitive)
            const target = word.word.toLowerCase();
            const matchedSentence = sentences.find(s =>
                s.toLowerCase().includes(target)
            );
            word.sentence = matchedSentence || chunkText.substring(0, 100) + "..."; // Fallback
        }

        return word;
    });
}

// generateNewContext is deprecated as it's now merged into extractKeywords for performance
// Kept commented out for reference or fallback if needed
// export async function generateNewContext(word, definition, model = DEFAULT_MODEL, signal = null) { ... }

const THOUGHT_GROUP_PROMPT = `You are a linguistic expert specializing in English prosody and syntax.
Your task is to divide a given sentence into "Thought Groups" (semantic chunks) to help learners with phrasing and rhythm.

Rules:
- Divide based on natural pauses, grammatical boundaries, and meaningful units.
- Each group should be 2-5 words.
- Provide a brief "focus hint" for each group (e.g., "subject", "action", "detail").

Output ONLY valid JSON array:
[
  {
    "text": "The rapid advancement",
    "hint": "subject"
  },
  {
    "text": "of artificial intelligence",
    "hint": "modifier"
  }
]`;

/**
 * Split a sentence into semantic thought groups
 * @param {string} sentence - The sentence to split
 * @param {string} model - The model to use
 * @param {AbortSignal} signal - Optional AbortSignal for cancellation
 */
export async function splitSentenceIntoGroups(sentence, model = DEFAULT_MODEL, signal = null) {
    const prompt = `${THOUGHT_GROUP_PROMPT}

Sentence:
${sentence}`;

    const response = await callOllama(prompt, model, signal);
    return parseJsonResponse(response);
}

/**
 * Generate core thesis from document
 * @param {string} text - The text to summarize
 * @param {string} model - The model to use
 * @param {AbortSignal} signal - Optional AbortSignal for cancellation
 */
export async function generateCoreThesis(text, model = DEFAULT_MODEL, signal = null) {
    const prompt = `Summarize the core thesis of this text in ONE sentence (max 30 words).
Focus on the main argument or central idea.
Output ONLY the thesis statement, nothing else.

Text:
${text.substring(0, 2000)}`; // Limit input length

    const response = await callOllama(prompt, model, signal);
    return response.trim();
}

/**
 * Translate an array of sentences
 * @param {string[]} sentences - The sentences to translate
 * @param {string} model - The model to use
 * @param {AbortSignal} signal - Optional AbortSignal for cancellation
 */
export async function translateSentences(sentences, model = DEFAULT_MODEL, signal = null) {
    if (!sentences || sentences.length === 0) return [];

    const prompt = `You are a professional translator.
Translate the following English sentences into natural, accurate Chinese.
Return ONLY a JSON array of strings, in the same order as the input.

Sentences:
${JSON.stringify(sentences)}

Output Format:
["翻译1", "翻译2", ...]`;

    const response = await callOllama(prompt, model, signal);
    return parseJsonResponse(response);
}

export default {
    chunkDocument,
    extractKeywords,
    translateSentences,
    generateCoreThesis
};
