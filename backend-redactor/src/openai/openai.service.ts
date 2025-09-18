import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private client: any;
  private readonly logger = new Logger(OpenAIService.name);

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      this.logger.error('OPENAI_API_KEY not set');
      throw new Error('OPENAI_API_KEY not set');
    }
    this.client = new OpenAI({ apiKey });
  }

  async generateText(prompt: string, maxTokens = 256) {
    const res = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
    });
    return res.choices?.[0]?.message?.content ?? '';
  }

  async generateImage(prompt: string, size = '1024x1024') {
    const res = await this.client.images.generate({ model: 'gpt-image-1', prompt, size, n: 1 });
    const data = res.data?.[0];
    if (!data) throw new Error('No image data');
    if (data.b64_json) return { b64: data.b64_json };
    if (data.url) return { url: data.url };
    throw new Error('Unexpected image response');
  }

  async inpaintImage(prompt: string, base64Image: string, base64Mask: string, size = '1024x1024') {
    // OpenAI v1 images/edit accepting image/mask. With SDK v5, use multipart:
    const res = await this.client.images.edits({
      model: 'gpt-image-1',
      prompt,
      image: base64Image,
      mask: base64Mask,
      size,
      n: 1,
    });
    const data = res.data?.[0];
    if (!data) throw new Error('No image data');
    if (data.b64_json) return { b64: data.b64_json };
    if (data.url) return { url: data.url };
    throw new Error('Unexpected image response');
  }
}
