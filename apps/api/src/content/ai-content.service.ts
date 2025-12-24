import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';

const questResponseSchema = z.object({
  daily: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        reward: z.number().min(1).max(400),
        audience: z.enum(['LAID_OFF', 'RETIRED', 'SHARED']).default('SHARED'),
        type: z.enum(['TASK', 'COMMUNITY', 'WELLNESS']).default('TASK'),
      })
    )
    .min(1),
  weekly: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        reward: z.number().min(1).max(600),
        audience: z.enum(['LAID_OFF', 'RETIRED', 'SHARED']).default('SHARED'),
        type: z.enum(['TASK', 'COMMUNITY', 'WELLNESS']).default('TASK'),
      })
    )
    .min(1),
});

const rewardItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  cost: z.number().min(50).max(800),
});

const rewardResponseSchema = z.union([
  z.array(rewardItemSchema),
  z.object({ rewards: z.array(rewardItemSchema) }),
]);

@Injectable()
export class AiContentService {
  private readonly logger = new Logger(AiContentService.name);
  private readonly hfModel = process.env.HF_MODEL ?? 'mistralai/Mistral-7B-Instruct';
  private readonly hfApiUrl = 'https://api-inference.huggingface.co/models';
  private readonly openAiModel = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
  private readonly openAiMaxTokens = Number(process.env.OPENAI_MAX_TOKENS ?? '600');

  private async generate(prompt: string) {
    if (process.env.OPENAI_API_KEY) {
      return this.generateWithOpenAI(prompt);
    }
    if (process.env.HF_API_TOKEN) {
      return this.generateWithHuggingFace(prompt);
    }
    this.logger.warn('No OPENAI_API_KEY or HF_API_TOKEN configured; skipping AI generation.');
    return null;
  }

  private async generateWithOpenAI(prompt: string) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: this.openAiModel,
        messages: [
          {
            role: 'system',
            content: 'You generate JSON payloads for LifeQuest, a productivity RPG for laid-off professionals and retirees.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.6,
        max_tokens: this.openAiMaxTokens,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      this.logger.error(`OpenAI error: ${response.status} ${response.statusText} - ${text}`);
      return null;
    }
    const json = await response.json();
    const text = json.choices?.[0]?.message?.content ?? '';
    return text.trim();
  }

  private async generateWithHuggingFace(prompt: string) {
    const response = await fetch(`${this.hfApiUrl}/${this.hfModel}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.8,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      this.logger.error(`HF API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = (await response.json()) as any;
    const text = Array.isArray(json) ? json[0]?.generated_text ?? '' : json.generated_text ?? '';
    return text.trim();
  }

  async generateQuests() {
    const prompt = `You are an assistant helping a productivity game for laid-off professionals and retirees.
Return a JSON object with two arrays: "daily" (3 items) and "weekly" (2 items).
Each item must include title, description, reward (integer coins), audience (LAID_OFF, RETIRED, or SHARED) and type (TASK, COMMUNITY, WELLNESS).
Ensure the JSON is valid and concise.`;

    const output = await this.generate(prompt);
    if (!output) return null;
    try {
      const json = questResponseSchema.parse(JSON.parse(output));
      return json;
    } catch (error) {
      this.logger.error('Failed to parse quest generation output', error as Error);
      return null;
    }
  }

  async generateRewards() {
    const prompt = `Generate a JSON array with 4 monthly reward ideas for a life quest game.
Each reward needs "name", "description", and "cost" (integer coins between 100-600).
Return only JSON.`;
    const output = await this.generate(prompt);
    if (!output) return null;
    try {
      const parsed = rewardResponseSchema.parse(JSON.parse(output));
      return Array.isArray(parsed) ? parsed : parsed.rewards;
    } catch (error) {
      this.logger.error('Failed to parse reward generation output', error as Error);
      return null;
    }
  }
}
