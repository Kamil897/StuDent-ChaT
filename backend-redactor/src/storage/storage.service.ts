import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadDir = path.resolve('./uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Upload dir created: ${this.uploadDir}`);
    }
  }

  async uploadBuffer(buffer: Buffer, destPath: string, contentType = 'image/png') {
    const filePath = path.join(this.uploadDir, destPath);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    // возвращаем URL для фронтенда
    return `/uploads/${destPath}`;
  }

  async uploadBase64(b64: string, destPath: string) {
    const buffer = Buffer.from(b64, 'base64');
    return this.uploadBuffer(buffer, destPath, 'image/png');
  }
}
