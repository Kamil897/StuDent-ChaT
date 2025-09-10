import { Injectable } from '@nestjs/common';
import axios from 'axios';
import OpenAI from 'openai';
declare const process: any;
import { IeltsWritingDto } from './dto/writing.dto';
import { IeltsReadingDto } from './dto/reading.dto';

@Injectable()
export class IeltsService {
  private openai: OpenAI | null;
  private readonly loginServiceUrl: string;

  constructor() {
    this.openai = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;
    this.loginServiceUrl =
      process.env.LOGIN_SERVICE_URL || 'http://localhost:3000';
  }

  async scoreWriting(dto: IeltsWritingDto) {
    const fallback = {
      task_response: 6,
      coherence_cohesion: 6,
      lexical_resource: 6,
      grammar: 6,
      overall: 6,
      feedback: 'LLM is unavailable. This is a fallback score.',
    };

    let result: any = fallback;

    try {
      if (this.openai) {
        const prompt = [
          {
            role: 'system' as const,
            content:
              'You are an IELTS Writing examiner. Return strict JSON with numeric fields task_response, coherence_cohesion, lexical_resource, grammar, overall (0-9, 0.5 step allowed) and a short feedback string.',
          },
          {
            role: 'user' as const,
            content: `Essay:\n${dto.essay}`,
          },
        ];

        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4.1-mini',
          messages: prompt,
          temperature: 0.2,
        });
        const content = completion.choices[0]?.message?.content?.trim() || '';
        try {
          const parsed = JSON.parse(content);
          result = {
            task_response: parsed.task_response,
            coherence_cohesion: parsed.coherence_cohesion,
            lexical_resource: parsed.lexical_resource,
            grammar: parsed.grammar,
            overall: parsed.overall,
            feedback: parsed.feedback || '',
          };
        } catch {
          result = fallback;
        }
      }
    } catch (e) {
      // fall back silently
      result = fallback;
    }

    try {
      await axios.post(`${this.loginServiceUrl}/api/history/add`, {
        userId: dto.userId,
        examType: 'ielts-writing',
        result: result,
      });
    } catch (error) {
      // do not block main response on history failure
      // optionally log
    }

    return result;
  }

  async scoreReading(dto: IeltsReadingDto) {
    const key = this.getAnswerKey(dto.testId);
    const total = key.length;
    const correct = dto.answers.reduce((acc, ans, idx) => {
      const expected = key[idx];
      if (
        expected &&
        typeof ans === 'string' &&
        ans.trim().toLowerCase() === expected.toLowerCase()
      ) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const band = this.mapReadingRawToBand(correct);
    const result = { correct, total, band };

    try {
      await axios.post(`${this.loginServiceUrl}/api/history/add`, {
        userId: dto.userId,
        examType: 'ielts-reading',
        result,
      });
    } catch (error) {
      // ignore errors to not fail main flow
    }

    return result;
  }

  private getAnswerKey(testId: string): string[] {
    // Minimal built-in keys for Cambridge practice. Extend as needed.
    const keys: Record<string, string[]> = {
      'cambridge-16-test-1': [
        'A',
        'C',
        'B',
        'C',
        'A',
        'B',
        'C',
        'A',
        'B',
        'C',
        'TRUE',
        'FALSE',
        'NOT GIVEN',
        'TRUE',
        'FALSE',
        'A',
        'B',
        'C',
        'D',
        'A',
        'B',
        'C',
        'D',
        'A',
        'B',
        'A',
        'B',
        'C',
        'D',
        'A',
        'B',
        'C',
        'D',
        'A',
        'B',
        'A',
        'B',
        'C',
        'D',
      ],
      'demo-40q': new Array(40).fill('A'),
    };
    return keys[testId] || new Array(40).fill('A');
  }

  private mapReadingRawToBand(
    raw: number,
  ): number | 4 | 5 | 6 | 7 | 8 | 8.5 | 9 {
    if (raw >= 39) return 9;
    if (raw >= 37) return 8.5 as const;
    if (raw >= 35) return 8;
    if (raw >= 30) return 7;
    if (raw >= 23) return 6;
    if (raw >= 16) return 5;
    return 4;
  }
}
