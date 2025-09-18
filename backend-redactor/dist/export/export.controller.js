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
exports.ExportController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ExportController = class ExportController {
    async exportPng(dataUrl, res) {
        if (!(dataUrl === null || dataUrl === void 0 ? void 0 : dataUrl.startsWith('data:image/png')))
            throw new common_1.BadRequestException('Invalid dataUrl');
        const b64 = dataUrl.replace(/^data:image\/png;base64,/, '');
        const buf = Buffer.from(b64, 'base64');
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename="canvas.png"');
        return res.end(buf);
    }
    async exportSvg(svg, res) {
        if (!(svg === null || svg === void 0 ? void 0 : svg.includes('<svg')))
            throw new common_1.BadRequestException('Invalid svg');
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', 'attachment; filename="canvas.svg"');
        return res.end(svg);
    }
};
exports.ExportController = ExportController;
__decorate([
    (0, common_1.Post)('png'),
    __param(0, (0, common_1.Body)('dataUrl')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportPng", null);
__decorate([
    (0, common_1.Post)('svg'),
    __param(0, (0, common_1.Body)('svg')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportSvg", null);
exports.ExportController = ExportController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/export')
], ExportController);
//# sourceMappingURL=export.controller.js.map