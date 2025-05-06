import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*', // Разрешает подключение с любого фронтенда (можно ограничить)
    },
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      console.log(`Клиент подключился: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Клиент отключился: ${client.id}`);
    }
  
    @SubscribeMessage('sendMessage')
    handleMessage(client: Socket, payload: any) {
      this.server.emit('receiveMessage', payload); // рассылаем всем подключенным
    }
  }
  