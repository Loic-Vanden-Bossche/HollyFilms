import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { ProcessingService } from './processing.service';
import { Socket } from 'net';
import { UseGuards } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { JwtAuthGuard } from '../indentity/auth/guards/jwt.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '../shared/role';

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

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @SubscribeMessage('getMainProcessStatus')
  onEvent(): void {
    this.websocketService.emit(
      'processing-media',
      this.processingService.progressStatus,
    );
  }
}
