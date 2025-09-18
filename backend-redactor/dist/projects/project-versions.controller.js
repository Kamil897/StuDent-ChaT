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
exports.ProjectVersionsController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const project_entity_1 = require("./project.entity");
const project_version_entity_1 = require("./project-version.entity");
let ProjectVersionsController = class ProjectVersionsController {
    constructor(projects, versions) {
        this.projects = projects;
        this.versions = versions;
    }
    async list(req, id) {
        const project = await this.projects.findOne({ where: { id: Number(id), userId: req.user.id } });
        if (!project)
            throw new common_1.BadRequestException('Project not found');
        return this.versions.find({ where: { projectId: project.id }, order: { created_at: 'DESC' } });
    }
    async restore(req, id, versionId) {
        const project = await this.projects.findOne({ where: { id: Number(id), userId: req.user.id } });
        if (!project)
            throw new common_1.BadRequestException('Project not found');
        const v = await this.versions.findOne({ where: { id: Number(versionId), projectId: project.id } });
        if (!v)
            throw new common_1.BadRequestException('Version not found');
        project.items = v.items;
        const saved = await this.projects.save(project);
        return { project: saved };
    }
};
exports.ProjectVersionsController = ProjectVersionsController;
__decorate([
    (0, common_1.Get)(':id/versions'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ProjectVersionsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(':id/restore/:versionId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('versionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ProjectVersionsController.prototype, "restore", null);
exports.ProjectVersionsController = ProjectVersionsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/projects'),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(project_version_entity_1.ProjectVersion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectVersionsController);
//# sourceMappingURL=project-versions.controller.js.map