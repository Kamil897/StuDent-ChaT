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
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
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
    async generateImage(req, prompt) {
        if (!prompt)
            throw new common_1.BadRequestException('prompt required');
        const result = await this.openai.generateImage(prompt, '1024x1024');
        if (result.b64) {
            const saved = await this.assets.uploadBase64AndSaveForUser(req.user.id, result.b64, prompt);
            return { asset: saved };
        }
        if (result.url) {
            const saved = await this.assets.saveAssetForUser(req.user.id, result.url, prompt);
            return { asset: saved };
        }
        throw new common_1.BadRequestException('Unexpected image result');
    }
    async inpaint(req, prompt, imageB64, maskB64) {
        if (!prompt || !imageB64 || !maskB64)
            throw new common_1.BadRequestException('prompt, imageB64, maskB64 required');
        const result = await this.openai.inpaintImage(prompt, imageB64, maskB64, '1024x1024');
        if (result.b64) {
            const saved = await this.assets.uploadBase64AndSaveForUser(req.user.id, result.b64, prompt);
            return { asset: saved };
        }
        if (result.url) {
            const saved = await this.assets.saveAssetForUser(req.user.id, result.url, prompt);
            return { asset: saved };
        }
        throw new common_1.BadRequestException('Unexpected inpaint result');
    }
    async generateBackground(req, prompt) {
        if (!prompt)
            throw new common_1.BadRequestException('prompt required');
        const result = await this.openai.generateImage(prompt, '1920x1080');
        if (result.b64) {
            const saved = await this.assets.uploadBase64AndSaveForUser(req.user.id, result.b64, prompt);
            return { asset: saved };
        }
        if (result.url) {
            const saved = await this.assets.saveAssetForUser(req.user.id, result.url, prompt);
            return { asset: saved };
        }
        throw new common_1.BadRequestException('Unexpected background result');
    }
    async uploadFile(req, file, prompt) {
        if (!file)
            throw new common_1.BadRequestException('file required');
        const fs = require('fs');
        const buffer = fs.readFileSync(file.path);
        const b64 = buffer.toString('base64');
        const saved = await this.assets.uploadBase64AndSaveForUser(req.user.id, b64, prompt, file.originalname);
        fs.unlinkSync(file.path);
        return { asset: saved };
    }
    async getAssets(req) {
        return this.assets.listAllForUser(req.user.id);
    }
};
exports.AssetsController = AssetsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('generate-text'),
    __param(0, (0, common_1.Body)('prompt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "generateText", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('generate-image'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('prompt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "generateImage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('inpaint'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('prompt')),
    __param(2, (0, common_1.Body)('imageB64')),
    __param(3, (0, common_1.Body)('maskB64')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "inpaint", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('generate-background'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('prompt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "generateBackground", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
        }),
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('prompt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('assets'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "getAssets", null);
exports.AssetsController = AssetsController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [openai_service_1.OpenAIService, assets_service_1.AssetsService])
], AssetsController);
//# sourceMappingURL=assets.controller.js.map