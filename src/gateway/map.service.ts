import { Injectable } from '@nestjs/common';

@Injectable()
export class MapService {
  private readonly map: Map<string, any>;

  constructor() {
    this.map = new Map();
  }

  getMap(): Map<string, any> {
    return this.map;
  }

  setNewUser(userId: string, socketId: string) {
    this.map.set(userId, socketId);
  }

  getKeysUsers() {
    return Array.from(this.map.keys());
  }

  getUser(id: string) {
    return this.map.get(id);
  }
}
