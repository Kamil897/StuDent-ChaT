import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { StorageService } from '../storage/storage.service';
export declare class AssetsService {
    private repo;
    private storage;
    constructor(repo: Repository<Asset>, storage: StorageService);
    listAllForUser(userId: number): Promise<Asset[]>;
    saveAssetForUser(userId: number, url: string, prompt?: string, filename?: string): Promise<Asset>;
    uploadBase64AndSaveForUser(userId: number, b64: string, prompt?: string, filename?: string): Promise<Asset>;
}
