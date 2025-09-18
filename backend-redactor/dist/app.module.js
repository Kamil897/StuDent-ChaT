"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dotenv = require("dotenv");
const openai_module_1 = require("./openai/openai.module");
const assets_module_1 = require("./assets/assets.module");
const auth_module_1 = require("./auth/auth.module");
const projects_module_1 = require("./projects/projects.module");
const collab_module_1 = require("./collab/collab.module");
const templates_module_1 = require("./templates/templates.module");
const styled_text_module_1 = require("./styled-text/styled-text.module");
const export_module_1 = require("./export/export.module");
dotenv.config();
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.MYSQL_HOST || 'localhost',
                port: Number(process.env.MYSQL_PORT || 3306),
                username: process.env.MYSQL_USER || 'root',
                password: process.env.MYSQL_PASS || '',
                database: process.env.MYSQL_DB || 'ai_editor',
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
            openai_module_1.OpenAIModule,
            assets_module_1.AssetsModule,
            auth_module_1.AuthModule,
            projects_module_1.ProjectsModule,
            collab_module_1.CollabModule,
            templates_module_1.TemplatesModule,
            styled_text_module_1.StyledTextModule,
            export_module_1.ExportModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map