import { OpenAIService } from '../openai/openai.service';
import { AssetsService } from './assets.service';
export declare class AssetsController {
    private readonly openai;
    private readonly assets;
    constructor(openai: OpenAIService, assets: AssetsService);
    generateText(prompt: string): Promise<{
        text: any;
    }>;
    generateImage(req: any, prompt: string): Promise<{
        asset: import("./asset.entity").Asset;
    }>;
    inpaint(req: any, prompt: string, imageB64: string, maskB64: string): Promise<{
        asset: import("./asset.entity").Asset;
    }>;
    generateBackground(req: any, prompt: string): Promise<{
        asset: import("./asset.entity").Asset;
    }>;
    uploadFile(req: any, file: Express.Multer.File, prompt?: string): Promise<{
        asset: import("./asset.entity").Asset;
    }>;
    getAssets(req: any): Promise<import("./asset.entity").Asset[]>;
}
