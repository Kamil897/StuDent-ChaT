import { OpenAIService } from '../openai/openai.service';
import { AssetsService } from '../assets/assets.service';
export declare class StyledTextController {
    private readonly openai;
    private readonly assets;
    constructor(openai: OpenAIService, assets: AssetsService);
    generate(req: any, text: string, font: string, effect: string): Promise<{
        asset: import("../assets/asset.entity").Asset;
    }>;
}
