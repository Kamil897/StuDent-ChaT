"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const helmet_1 = require("helmet");
const bodyParser = require("body-parser");
const path = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.enableCors({ origin: true, credentials: true });
    app.use(bodyParser.json({ limit: '15mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));
    app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`✅ Backend running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map