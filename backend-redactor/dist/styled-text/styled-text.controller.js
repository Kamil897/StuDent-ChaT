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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyledTextController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const openai_service_1 = require("../openai/openai.service");
const assets_service_1 = require("../assets/assets.service");
let StyledTextController = class StyledTextController {
    constructor(openai, assets) {
        this.openai = openai;
        this.assets = assets;
    }
    async generate(req, text, font, effect) {
        if (!text)
            throw new common_1.BadRequestException('text required');
        const prompt = `Render text as image with font ${font || 'default'} and effect ${effect || 'none'}: ${text}`;
        const result = await this.openai.generateImage(prompt, '1024x256');
        if (result.b64) {
            const saved = await this.assets.uploadBase64AndSaveForUser(req.user.id, result.b64, prompt);
            return { asset: saved };
        }
        if (result.url) {
            const saved = await this.assets.saveAssetForUser(req.user.id, result.url, prompt);
            return { asset: saved };
        }
        throw new common_1.BadRequestException('Unexpected styled text result');
    }
};
exports.StyledTextController = StyledTextController;
__decorate([
    (0, common_1.Post)('generate-styled-text'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('text')),
    __param(2, (0, common_1.Body)('font')),
    __param(3, (0, common_1.Body)('effect')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], StyledTextController.prototype, "generate", null);
exports.StyledTextController = StyledTextController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [openai_service_1.OpenAIService, assets_service_1.AssetsService])
], StyledTextController);
//# sourceMappingURL=styled-text.controller.js.map