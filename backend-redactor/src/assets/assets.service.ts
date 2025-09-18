import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset) private repo: Repository<Asset>,
    private storage: StorageService,
  ) {}

  async listAllForUser(userId: number) {
    return this.repo.find({ where: { userId }, order: { created_at: 'DESC' } });
  }

  async saveAssetForUser(userId: number, url: string, prompt?: string, filename?: string) {
    const a = this.repo.create({ userId, url, prompt, filename });
    return this.repo.save(a);
  }

  async uploadBase64AndSaveForUser(userId: number, b64: string, prompt?: string, filename = `img-${Date.now()}.png`) {
    const dest = `uploads/${Date.now()}-${filename}`;
    const url = await this.storage.uploadBase64(b64, dest);
    return this.saveAssetForUser(userId, url, prompt, filename);
  }
}
