import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class CollabGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {}
  handleDisconnect(client: Socket) {}

  afterInit(server: Server) {
    server.use((socket, next) => {
      try {
        const authToken = (socket.handshake.auth as any)?.token || (socket.handshake.query as any)?.token;
        if (authToken) {
          const secret = process.env.JWT_SECRET || 'dev_jwt_secret';
          const payload: any = jwt.verify(String(authToken).replace(/^Bearer\s+/i, ''), secret);
          (socket as any).user = { id: payload.sub, email: payload.email, role: payload.role };
        }
      } catch (e) {
        // ignore invalid token; user stays undefined
      }
      next();
    });
  }

  @SubscribeMessage('joinProject')
  onJoinProject(client: Socket, payload: { projectId: number }) {
    if (!payload?.projectId) return;
    const room = `project:${payload.projectId}`;
    client.join(room);
    this.server.to(room).emit('userJoined', { userId: (client as any).user?.id || null });
  }

  @SubscribeMessage('updateCanvas')
  onUpdateCanvas(client: Socket, payload: { projectId: number; items: any[] }) {
    if (!payload?.projectId) return;
    const room = `project:${payload.projectId}`;
    client.to(room).emit('canvasUpdated', { items: payload.items, userId: (client as any).user?.id || null });
  }

  @SubscribeMessage('chatMessage')
  onChatMessage(client: Socket, payload: { projectId: number; message: string }) {
    if (!payload?.projectId || !payload?.message) return;
    const room = `project:${payload.projectId}`;
    this.server.to(room).emit('chatMessage', { message: payload.message, userId: (client as any).user?.id || null, ts: Date.now() });
  }
}

