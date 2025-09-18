import { OpenAIService } from '../openai/openai.service';
import { AssetsService } from './assets.service';
export declare class AssetsController {
    private readonly openai;
    private readonly assets;
    constructor(openai: OpenAIService, assets: AssetsService);
    generateText(prompt: string): Promise<{
        text: any;
    }>;
    generateImage(prompt: string): Promise<{
        asset: import("./asset.entity").Asset;
    }>;
    uploadFile(file: Express.Multer.File, prompt?: string): Promise<{
        asset: import("./asset.entity").Asset;
    }>;
    getAssets(): Promise<import("./asset.entity").Asset[]>;
}
