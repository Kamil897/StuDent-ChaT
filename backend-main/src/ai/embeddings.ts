import * as crypto from 'crypto';

// Фейковый эмбеддинг (для теста). Можно подключить openai/embeddings или langchain.
export async function embed(text: string): Promise<number[]> {
  const hash = crypto.createHash('sha256').update(text).digest();
  return Array.from(hash).map((b) => b / 255);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
}
