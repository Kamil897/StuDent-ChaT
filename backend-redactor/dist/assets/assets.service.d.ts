import { Repository } from 'typeorm';
import { Asset } from './asset.entity';
import { StorageService } from '../storage/storage.service';
export declare class AssetsService {
    private repo;
    private storage;
    constructor(repo: Repository<Asset>, storage: StorageService);
    listAll(): Promise<Asset[]>;
    saveAsset(url: string, prompt?: string, filename?: string): Promise<Asset>;
    uploadBase64AndSave(b64: string, prompt?: string, filename?: string): Promise<Asset>;
}
