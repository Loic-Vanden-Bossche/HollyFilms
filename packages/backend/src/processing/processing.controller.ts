import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { FileData, ProcessingService } from './processing.service';
import { ScrapperService } from './scrapper.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '../shared/role';

@ApiTags('Processing')
@Controller('processing')
export class ProcessingController {
  constructor(
    private readonly processService: ProcessingService,
    private readonly scrapperService: ScrapperService,
  ) {}

  @Roles(Role.Admin)
  @Get('onlineSearch')
  @ApiOperation({
    summary: '[Admin] Engage a scrapping request to search movies',
  })
  async getOnlineSearchResults(@Query('query') query: string): Promise<void> {
    return this.scrapperService.query(query);
  }

  @Roles(Role.Admin)
  @Get('initialData')
  @ApiOperation({
    summary: '[Admin] Get initial processing data',
  })
  async getInitialData() {
    return this.processService.getInitialData();
  }

  @Roles(Role.Admin)
  @Post('onlineSearch/getmediaLink')
  @ApiOperation({ summary: '[Admin] Get uptobox premium link' })
  async getmediaLink(@Body('link') link: string): Promise<void> {
    return this.scrapperService.getPremiumLink(link);
  }

  @Roles(Role.Admin)
  @Get('localSearch')
  @ApiOperation({ summary: '[Admin] Search in hard space for files' })
  async getLocalSearchResults(
    @Query('query') query: string,
  ): Promise<FileData[]> {
    return this.processService.searchQuery(query);
  }

  @Roles(Role.Admin)
  @Get('startQueue')
  @ApiOperation({ summary: '[Admin] Start processing queue' })
  async startQueue() {
    this.processService.startQueue();
  }

  @Roles(Role.Admin)
  @Get('stopQueue')
  @ApiOperation({ summary: '[Admin] Stop processing queue' })
  async stopQueue() {
    this.processService.stopQueue();
  }

  @Roles(Role.Admin)
  @Delete('removeFromQueue/:id')
  @ApiOperation({ summary: '[Admin] Stop processing queue' })
  async removeFromQueue(@Param('id') id: string) {
    return this.processService.removeFromQueue(id);
  }

  @Roles(Role.Admin)
  @Get('clearQueue')
  @ApiOperation({ summary: '[Admin] Clear all unprocessing files' })
  async clearQueue(): Promise<{ needRefresh: boolean }> {
    return { needRefresh: await this.processService.clearQueue() };
  }

  @Roles(Role.Admin)
  @Get('startGeneration/:id/:name')
  @ApiOperation({ summary: '[Admin] Start generation of extra streams' })
  async startGeneration(@Param('id') id: string, @Param('name') name: string) {
    this.processService.startGeneration(id, name);
  }
}
