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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TemplatesController = class TemplatesController {
    list() {
        return [
            {
                id: 'business-card',
                name: 'Визитка',
                items: [
                    { id: 1, type: 'text', text: 'Иван Иванов', x: 100, y: 120, fontSize: 28 },
                    { id: 2, type: 'text', text: 'Frontend Developer', x: 100, y: 160, fontSize: 18 },
                ],
            },
            {
                id: 'poster',
                name: 'Постер',
                items: [
                    { id: 1, type: 'text', text: 'AI Conference 2025', x: 320, y: 100, fontSize: 36 },
                ],
            },
            {
                id: 'presentation',
                name: 'Презентация',
                items: [
                    { id: 1, type: 'text', text: 'Заголовок слайда', x: 200, y: 80, fontSize: 32 },
                    { id: 2, type: 'text', text: 'Пункт 1', x: 200, y: 140, fontSize: 20 },
                    { id: 3, type: 'text', text: 'Пункт 2', x: 200, y: 180, fontSize: 20 },
                ],
            },
        ];
    }
};
exports.TemplatesController = TemplatesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TemplatesController.prototype, "list", null);
exports.TemplatesController = TemplatesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/templates')
], TemplatesController);
//# sourceMappingURL=templates.controller.js.map