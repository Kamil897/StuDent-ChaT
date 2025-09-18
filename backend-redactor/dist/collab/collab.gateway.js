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
exports.CollabGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt = require("jsonwebtoken");
let CollabGateway = class CollabGateway {
    handleConnection(client) { }
    handleDisconnect(client) { }
    afterInit(server) {
        server.use((socket, next) => {
            var _a, _b;
            try {
                const authToken = ((_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) || ((_b = socket.handshake.query) === null || _b === void 0 ? void 0 : _b.token);
                if (authToken) {
                    const secret = process.env.JWT_SECRET || 'dev_jwt_secret';
                    const payload = jwt.verify(String(authToken).replace(/^Bearer\s+/i, ''), secret);
                    socket.user = { id: payload.sub, email: payload.email, role: payload.role };
                }
            }
            catch (e) {
            }
            next();
        });
    }
    onJoinProject(client, payload) {
        var _a;
        if (!(payload === null || payload === void 0 ? void 0 : payload.projectId))
            return;
        const room = `project:${payload.projectId}`;
        client.join(room);
        this.server.to(room).emit('userJoined', { userId: ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id) || null });
    }
    onUpdateCanvas(client, payload) {
        var _a;
        if (!(payload === null || payload === void 0 ? void 0 : payload.projectId))
            return;
        const room = `project:${payload.projectId}`;
        client.to(room).emit('canvasUpdated', { items: payload.items, userId: ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id) || null });
    }
    onChatMessage(client, payload) {
        var _a;
        if (!(payload === null || payload === void 0 ? void 0 : payload.projectId) || !(payload === null || payload === void 0 ? void 0 : payload.message))
            return;
        const room = `project:${payload.projectId}`;
        this.server.to(room).emit('chatMessage', { message: payload.message, userId: ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id) || null, ts: Date.now() });
    }
};
exports.CollabGateway = CollabGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CollabGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinProject'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], CollabGateway.prototype, "onJoinProject", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateCanvas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], CollabGateway.prototype, "onUpdateCanvas", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chatMessage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], CollabGateway.prototype, "onChatMessage", null);
exports.CollabGateway = CollabGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: true, credentials: true } })
], CollabGateway);
//# sourceMappingURL=collab.gateway.js.map