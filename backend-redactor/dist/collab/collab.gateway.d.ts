import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class CollabGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    afterInit(server: Server): void;
    onJoinProject(client: Socket, payload: {
        projectId: number;
    }): void;
    onUpdateCanvas(client: Socket, payload: {
        projectId: number;
        items: any[];
    }): void;
    onChatMessage(client: Socket, payload: {
        projectId: number;
        message: string;
    }): void;
}
