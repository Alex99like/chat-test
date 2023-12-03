import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MapService } from './map.service';

@WebSocketGateway({ perMessageDeflate: true, cors: '*' })
export class MyGateway implements OnModuleInit {
  constructor(private mapService: MapService) {}
  private onlineUsers = new Map();

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  @SubscribeMessage('add-user')
  setNewUser(client: Socket, userId: string): void {
    console.log(client.id);
    this.mapService.setNewUser(userId, client.id);
    this.server.emit('online-user', this.mapService.getKeysUsers());
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: body,
    });
  }

  @SubscribeMessage('msg-handle')
  messageHandle(
    client: Socket,
    data: {
      to: string;
      from: string;
      active: boolean;
    },
  ) {
    const sendUserSocket = this.mapService.getUser(data.to);
    if (sendUserSocket) {
      this.server.to(sendUserSocket).emit('handle-active', {
        to: data.to,
        from: data.from,
        active: data.active,
      });
    }
  }

  @SubscribeMessage('send-msg')
  handleSendMessage(
    client: Socket,
    data: {
      id: string;
      to: string;
      from: string;
      message: string;
      type: string;
      messageStatus: string;
    },
  ): void {
    const sendUserSocket = this.mapService.getUser(data.to);
    console.log(sendUserSocket);
    if (sendUserSocket) {
      this.server.to(sendUserSocket).emit('msg-receive', {
        id: data.id,
        to: data.to,
        from: data.from,
        type: data.type,
        message: data.message,
        messageStatus: data.messageStatus,
      });
    }
  }
}
