export declare class StorageService {
    private readonly logger;
    private readonly uploadDir;
    constructor();
    uploadBuffer(buffer: Buffer, destPath: string, contentType?: string): Promise<string>;
    uploadBase64(b64: string, destPath: string): Promise<string>;
}
