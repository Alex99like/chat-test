import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { MapService } from './map.service';

@Module({
  providers: [MyGateway, MapService],
})
export class GatewayModule {}
