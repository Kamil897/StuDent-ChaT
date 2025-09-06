import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { exec } from 'child_process';
import { platform } from 'os';

@Injectable()
export class AiStatusService {
  private running = false;

  // Проверяем доступность phi-3
  async getStatus() {
    try {
      const res = await axios.post('http://localhost:11434/api/generate', {
        model: "phi3",
        prompt: "ping"
      }, { timeout: 2000 });

      // если ответ нормальный — значит работает
      this.running = res.status === 200;
    } catch (e) {
      this.running = false;
    }
    return { running: this.running };
  }

  // Включение/выключение phi-3
  async setStatus(running: boolean) {
    if (running) {
      // запускаем модель phi3 через Ollama
      exec('ollama run phi3', (err, stdout, stderr) => {
        if (err) {
          console.error('Ошибка запуска phi3:', err);
          return;
        }
        console.log(stdout || stderr);
      });
    } else {
      // останавливаем phi3 (kill процесса ollama) - учитываем Windows
      const isWindows = platform() === 'win32';
      const killCommand = isWindows 
        ? 'taskkill /f /im ollama.exe' 
        : 'pkill -f "ollama run phi3"';
        
      exec(killCommand, (err) => {
        if (err) {
          console.error('Ошибка остановки phi3:', err);
        }
      });
    }

    this.running = running;
    return { running: this.running };
  }
}
