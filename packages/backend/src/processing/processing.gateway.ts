import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';

import { ProcessingService } from './processing.service';
import { Socket } from 'net';
import { WebsocketService } from './websocket.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200', 'https://hollyfilms.fr'],
    credentials: true,
  },
  namespace: '/api/processing',
  path: '/api/processing',
})
export class ProcessingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly websocketService: WebsocketService,
    private readonly processingService: ProcessingService,
  ) {}

  handleConnection(client: Socket) {
    this.websocketService.addClient(client);
  }

  handleDisconnect(client: Socket) {
    this.websocketService.removeClient(client);
  }
}
