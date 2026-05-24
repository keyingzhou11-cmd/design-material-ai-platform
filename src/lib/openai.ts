import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'not-configured',
});

export const ANALYSIS_SYSTEM_PROMPT = `你是一位资深设计分析师。请分析设计图片，并返回结构化 JSON：
- summary：2-3 句简洁、专业的中文设计解读
- colorPalette：识别到的十六进制色值数组
- typography：中文字体观察要点
- layoutNotes：中文版式与构图观察要点
- mood：1-2 个中文词概括视觉气质
- tags：5-8 个中文设计标签
- styleKeywords：3-5 个中文风格关键词

只返回合法 JSON，不要输出 markdown。`;
