import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const ANALYSIS_SYSTEM_PROMPT = `You are an expert design analyst. Analyze design images and return structured JSON with:
- summary: brief overview (2-3 sentences)
- colorPalette: array of hex colors found
- typography: typography observations
- layoutNotes: layout and composition notes
- mood: emotional tone (1-2 words)
- tags: relevant design tags (5-8)
- styleKeywords: style descriptors (3-5)

Respond ONLY with valid JSON, no markdown.`;
