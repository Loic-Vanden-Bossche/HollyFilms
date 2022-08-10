import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WebsocketService {
  clients: Socket[] = [];

  get clientsConnected() {
    return !!this.clients.length;
  }

  addClient(client: any) {
    this.clients.push(client);
  }

  removeClient(client: any) {
    const index = this.clients.findIndex((socket) => socket.id == client.id);

    if (index > -1) {
      this.clients.splice(index, 1);
    }
  }

  emit(channel: string, data: any, clientOP?: any) {
    if (clientOP) {
      clientOP.emit(channel, data);
    } else {
      for (const client of this.clients) {
        client.emit(channel, data);
      }
    }
  }
}
