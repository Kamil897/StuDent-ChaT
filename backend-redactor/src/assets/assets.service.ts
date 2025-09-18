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

  async listAll() {
    return this.repo.find({ order: { created_at: 'DESC' } });
  }

  async saveAsset(url: string, prompt?: string, filename?: string) {
    const a = this.repo.create({ url, prompt, filename });
    return this.repo.save(a);
  }

  async uploadBase64AndSave(b64: string, prompt?: string, filename = `img-${Date.now()}.png`) {
    const dest = `uploads/${Date.now()}-${filename}`;
    const url = await this.storage.uploadBase64(b64, dest);
    return this.saveAsset(url, prompt, filename);
  }
}
