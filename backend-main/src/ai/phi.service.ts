import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PhiService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async getPersona(personaId: number) {
    return this.prisma.aiPersona.findUnique({
      where: { id: personaId },
    });
  }

  async generateResponse(prompt: string, personaId: number) {
    const persona = await this.getPersona(personaId);

    if (!persona) {
      throw new Error(`AI персона с id ${personaId} не найдена`);
    }

    const finalPrompt = `${persona.prompt}\nПользователь: ${prompt}`;

    const res = await firstValueFrom(
      this.httpService.post('https://phi3.api.url/endpoint', {
        prompt: finalPrompt,
      }),
    );

    return {
      persona: persona.name,
      response: res.data,
    };
  }
}
