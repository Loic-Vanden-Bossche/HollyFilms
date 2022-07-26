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
import { env } from 'process';
import { JwtAuthGuard } from '../indentity/auth/guards/jwt.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '../shared/role';

let whitelist: string[];

if (env.NAME === 'prod') {
  whitelist = ['https://hollyfilms.fr', 'https://www.hollyfilms.fr'];
} else {
  whitelist = ['http://localhost:4200', 'http://127.0.0.1:4200', undefined];
}

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  },
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
