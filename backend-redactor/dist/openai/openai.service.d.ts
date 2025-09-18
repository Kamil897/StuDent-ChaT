export declare class OpenAIService {
    private client;
    private readonly logger;
    constructor();
    generateText(prompt: string, maxTokens?: number): Promise<any>;
    generateImage(prompt: string, size?: string): Promise<{
        b64: any;
        url?: undefined;
    } | {
        url: any;
        b64?: undefined;
    }>;
    inpaintImage(prompt: string, base64Image: string, base64Mask: string, size?: string): Promise<{
        b64: any;
        url?: undefined;
    } | {
        url: any;
        b64?: undefined;
    }>;
}
