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
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_entity_1 = require("./asset.entity");
const storage_service_1 = require("../storage/storage.service");
let AssetsService = class AssetsService {
    constructor(repo, storage) {
        this.repo = repo;
        this.storage = storage;
    }
    async listAll() {
        return this.repo.find({ order: { created_at: 'DESC' } });
    }
    async saveAsset(url, prompt, filename) {
        const a = this.repo.create({ url, prompt, filename });
        return this.repo.save(a);
    }
    async uploadBase64AndSave(b64, prompt, filename = `img-${Date.now()}.png`) {
        const dest = `uploads/${Date.now()}-${filename}`;
        const url = await this.storage.uploadBase64(b64, dest);
        return this.saveAsset(url, prompt, filename);
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_entity_1.Asset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        storage_service_1.StorageService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map