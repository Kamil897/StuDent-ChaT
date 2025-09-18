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
exports.AssetsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const openai_service_1 = require("../openai/openai.service");
const assets_service_1 = require("./assets.service");
let AssetsController = class AssetsController {
    constructor(openai, assets) {
        this.openai = openai;
        this.assets = assets;
    }
    async generateText(prompt) {
        if (!prompt)
            throw new common_1.BadRequestException('prompt required');
        const text = await this.openai.generateText(prompt);
        return { text };
    }
    async generateImage(prompt) {
        if (!prompt)
            throw new common_1.BadRequestException('prompt required');
        const result = await this.openai.generateImage(prompt, '1024x1024');
        if (result.b64) {
            const saved = await this.assets.uploadBase64AndSave(result.b64, prompt);
            return { asset: saved };
        }
        if (result.url) {
            const saved = await this.assets.saveAsset(result.url, prompt);
            return { asset: saved };
        }
        throw new common_1.BadRequestException('Unexpected image result');
    }
    async uploadFile(file, prompt) {
        if (!file)
            throw new common_1.BadRequestException('file required');
        const fs = require('fs');
        const buffer = fs.readFileSync(file.path);
        const b64 = buffer.toString('base64');
        const saved = await this.assets.uploadBase64AndSave(b64, prompt, file.originalname);
        fs.unlinkSync(file.path);
        return { asset: saved };
    }
    async getAssets() {
        return this.assets.listAll();
    }
};
exports.AssetsController = AssetsController;
__decorate([
    (0, common_1.Post)('generate-text'),
    __param(0, (0, common_1.Body)('prompt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "generateText", null);
__decorate([
    (0, common_1.Post)('generate-image'),
    __param(0, (0, common_1.Body)('prompt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "generateImage", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('prompt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('assets'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "getAssets", null);
exports.AssetsController = AssetsController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [openai_service_1.OpenAIService, assets_service_1.AssetsService])
], AssetsController);
//# sourceMappingURL=assets.controller.js.map