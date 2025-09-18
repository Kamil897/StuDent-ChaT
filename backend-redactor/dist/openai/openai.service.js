"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OpenAIService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
let OpenAIService = OpenAIService_1 = class OpenAIService {
    constructor() {
        this.logger = new common_1.Logger(OpenAIService_1.name);
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            this.logger.error('OPENAI_API_KEY not set');
            throw new Error('OPENAI_API_KEY not set');
        }
        this.client = new openai_1.default({ apiKey });
    }
    async generateText(prompt, maxTokens = 256) {
        var _a, _b, _c, _d;
        const res = await this.client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: maxTokens,
        });
        return (_d = (_c = (_b = (_a = res.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) !== null && _d !== void 0 ? _d : '';
    }
    async generateImage(prompt, size = '1024x1024') {
        var _a;
        const res = await this.client.images.generate({ model: 'gpt-image-1', prompt, size, n: 1 });
        const data = (_a = res.data) === null || _a === void 0 ? void 0 : _a[0];
        if (!data)
            throw new Error('No image data');
        if (data.b64_json)
            return { b64: data.b64_json };
        if (data.url)
            return { url: data.url };
        throw new Error('Unexpected image response');
    }
};
exports.OpenAIService = OpenAIService;
exports.OpenAIService = OpenAIService = OpenAIService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OpenAIService);
//# sourceMappingURL=openai.service.js.map