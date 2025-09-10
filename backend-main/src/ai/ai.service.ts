import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private client: OpenAI;
  private memory: Record<string, Array<{ role: string; content: string }>> = {};
  private memoryPath = path.resolve(process.cwd(), 'memory.json');

  constructor(private readonly httpService: HttpService) {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // 🔑 API-ключ из .env
    });
  }

  // =========================
  // 🔤 Определение языка
  // =========================
  private detectLanguage(text: string): 'ru' | 'en' | 'other' {
    if (/[а-яА-ЯёЁ]/.test(text)) return 'ru';
    if (/[a-zA-Z]/.test(text)) return 'en';
    return 'other';
  }

  private systemPromptByLang(lang: 'ru' | 'en' | 'other'): string {
    if (lang === 'ru') {
      return `
      Ты — цифровой учебный ассистент Cognia от компании Student-Chat.
      Отвечай ВСЕГДА на русском языке.
      Поддерживай тему: образование, экзамены, языки, математика, ИТ.
      Если вопрос вне тематики — мягко отклоняй.
      `.trim();
    }
    if (lang === 'en') {
      return `
    You are Cognia, a digital learning assistant by Student-Chat.
    Always respond in English.
    Keep the scope: education, exams, languages, math, IT.
    Reject unrelated topics.
      `.trim();
    }
    return `
    You are Cognia, a multilingual learning assistant by Student-Chat.
    Answer in the user's language. Focus only on education/IT/exams/languages/math.
    Reject unrelated topics.
    `.trim();
  }

  // =========================
  // ⬇️ Фильтр стиля/домена
  // =========================
  private enforceStyleAndDomain(message: string): string {
    const offTopic = [
      'политик',
      'политика',
      '18+',
      'порно',
      'оруж',
      'биржа',
      'ставк',
      'казино',
      'взлом',
      'хакинг',
      'наркот',
      'бомб',
      'террор',
      'религ',
      'рецепт',
      'анекдот',
      'новост',
    ];
    if (offTopic.some((k) => message.toLowerCase().includes(k))) {
      throw new BadRequestException(
        'Вопрос не относится к теме образования/ИТ.',
      );
    }

    return `
    Ты — Cognia (Student-Chat).
    Отвечай строго в рамках: образование, ИТ, экзамены, языки, математика.
    Формат ответа:
    1) Шаги обучения или алгоритм.
    2) Мини-пример / задание для практики.
    Если не уверен — скажи "не уверен, уточните".
    ---
    Вопрос: ${message}
    Ответ:
    `.trim();
  }

  // =========================
  // 📂 Память JSON
  // =========================
  private ensureMemoryFile() {
    if (!fs.existsSync(this.memoryPath)) {
      fs.writeFileSync(this.memoryPath, JSON.stringify([]), 'utf-8');
    }
  }

  private readMemory(): Array<{ q: string; a: string }> {
    this.ensureMemoryFile();
    try {
      return JSON.parse(fs.readFileSync(this.memoryPath, 'utf-8'));
    } catch {
      return [];
    }
  }

  private writeMemory(items: Array<{ q: string; a: string }>) {
    fs.writeFileSync(this.memoryPath, JSON.stringify(items, null, 2), 'utf-8');
  }

  private similarity(a: string, b: string): number {
    const sa = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
    const sb = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
    const inter = [...sa].filter((x) => sb.has(x)).length;
    const union = new Set([...sa, ...sb]).size || 1;
    return inter / union;
  }

  private searchMemory(query: string, threshold = 0.6): string | null {
    const mem = this.readMemory();
    let best: { a: string; score: number } | null = null;
    for (const item of mem) {
      const s = this.similarity(query, item.q);
      if (!best || s > best.score) best = { a: item.a, score: s };
    }
    return best && best.score >= threshold ? best.a : null;
  }

  private saveToMemory(q: string, a: string) {
    if (!q || !a) return;
    const mem = this.readMemory();
    mem.push({ q, a });
    if (mem.length > 500) mem.splice(0, mem.length - 500);
    this.writeMemory(mem);
  }

  // =========================
  // 🤝 GPT-4 с памятью
  // =========================
  async askGPT4(
    message: string,
    persona?: string,
  ): Promise<{ reply: string; source: 'memory' | 'model' }> {
    const cached = this.searchMemory(message, 0.6);
    if (cached) return { reply: cached, source: 'memory' };

    const filteredPrompt = this.enforceStyleAndDomain(
      persona ? `${persona}\n\n${message}` : message,
    );

    try {
      const lang = this.detectLanguage(message);
      const systemPrompt = persona || this.systemPromptByLang(lang);

      const completion = await this.client.chat.completions.create({
        model: 'gpt-4.1-nano', // можно 'gpt-4o-mini' для экономии
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: filteredPrompt },
        ],
        temperature: 0.3,
      });

      const reply =
        completion.choices[0].message?.content?.trim() || 'Нет ответа';
      this.saveToMemory(message, reply);
      return { reply, source: 'model' };
    } catch (error: any) {
      console.error('GPT-4 Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('GPT-4 service failed');
    }
  }

  // =========================
  // 🌊 Streaming GPT-4
  // =========================
  async askGPT4Stream(
    message: string,
    onChunk: (chunk: string) => void,
    persona?: string,
  ): Promise<void> {
    const cached = this.searchMemory(message, 0.6);
    if (cached) {
      onChunk(cached);
      return;
    }

    const filteredPrompt = this.enforceStyleAndDomain(
      persona ? `${persona}\n\n${message}` : message,
    );
    const lang = this.detectLanguage(message);
    const systemPrompt = persona || this.systemPromptByLang(lang);

    try {
      const stream = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: filteredPrompt },
        ],
        temperature: 0.3,
        stream: true,
      });

      let full = '';
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) {
          full += delta;
          onChunk(delta);
        }
      }

      if (full.trim()) {
        this.saveToMemory(message, full.trim());
      }
    } catch (error: any) {
      console.error(
        'GPT-4 Stream Error:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException('GPT-4 stream failed');
    }
  }

  // =========================
  // 🛡️ SAFE: Memory → GPT-4 → fallback
  // =========================
  async askAISafe(message: string, persona?: string) {
    const cached = this.searchMemory(message, 0.6);
    if (cached) return { reply: cached, source: 'memory' };

    try {
      const { reply } = await this.askGPT4(message, persona);
      return { reply, source: 'model' as const };
    } catch (e) {
      console.error('Model failed:', e);
    }

    const lang = this.detectLanguage(message);
    const fallback =
      lang === 'ru'
        ? 'Сейчас не могу получить ответ. Попробуйте позже.'
        : 'I cannot fetch an answer right now. Please try again later.';
    return { reply: fallback, source: 'fallback' as const };
  }

  async askAIStreamSafe(
    message: string,
    onChunk: (chunk: string) => void,
    persona?: string,
  ) {
    const cached = this.searchMemory(message, 0.6);
    if (cached) {
      onChunk(cached);
      return;
    }

    try {
      await this.askGPT4Stream(message, onChunk, persona);
    } catch (e) {
      console.error('Stream failed:', e);
      const lang = this.detectLanguage(message);
      const fallback =
        lang === 'ru'
          ? 'Сейчас не могу получить ответ. Попробуйте позже.'
          : 'I cannot fetch an answer right now. Please try again later.';
      onChunk(fallback);
    }
  }

  // =========================
  // 🔥 Метод: ask с userId + history
  // =========================
  async ask(userId: string, message: string, style: string, history?: any[]) {
    if (history) {
      this.memory[userId] = history.map((m) => ({
        role: m.role,
        content: m.text,
      }));
    }
    if (!this.memory[userId]) this.memory[userId] = [];
    this.memory[userId].push({ role: 'user', content: message });

    const persona = style
      ? `${style}\n\n${this.systemPromptByLang(this.detectLanguage(message))}`
      : undefined;
    const { reply, source } = await this.askAISafe(message, persona);

    this.memory[userId].push({ role: 'assistant', content: reply });
    return { reply, source, history: this.memory[userId] };
  }
}
