import { Module } from '@nestjs/common';
import {ProcessingGateway} from "./processing.gateway";
import {ProcessingService} from "./processing.service";
import {ProcessingController} from "./processing.controller";
import {WebsocketService} from "./websocket.service";
import {ScrapperService} from "./scrapper.service";
import {MediasModule} from "../medias/medias.module";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [MediasModule, HttpModule],
  controllers: [ProcessingController],
  providers: [ProcessingGateway, ProcessingService, WebsocketService, ScrapperService],
})
export class ProcessingModule {}
