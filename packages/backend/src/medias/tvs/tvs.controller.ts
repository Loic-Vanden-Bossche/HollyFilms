import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { TvsService } from "./tvs.service";
import { Roles } from "../../shared/decorators/roles.decorator";
import { Role } from "../../shared/role";
import { Media } from "../media.schema";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MediaWithType } from "../medias.utils";
import { AddTvDto } from "./dto/add.tv.dto";
import { AddEpisodeTvDto } from "./dto/add-episode.tv.dto";

@ApiTags("Tvs")
@Controller("tvs")
export class TvsController {
  constructor(private readonly tvsService: TvsService) {}

  @Get()
  @Roles(Role.User)
  @ApiOperation({ summary: "[User] Find all tvs stored in database" })
  async getAll(): Promise<Media[]> {
    return this.tvsService.findAll();
  }

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: "[Admin] Add a tv in database from TMDB" })
  async add(@Body() body: AddTvDto): Promise<MediaWithType> {
    return this.tvsService.add(body.tmdbId);
  }

  @Get(":id/add/:si")
  @Roles(Role.Admin)
  @ApiOperation({ summary: "[Admin] Add a season to tv data" })
  async addTvSeason(
    @Param("id") id: string,
    @Param("si") seasonIndex: number
  ): Promise<Media> {
    return this.tvsService.addSeason(id, seasonIndex);
  }

  @Post(":id/add/:si/:ei")
  @Roles(Role.Admin)
  @ApiOperation({ summary: "[Admin] Add episode to tv data" })
  async addTvEpisode(
    @Param("id") mediaId: string,
    @Param("si") seasonIndex: number,
    @Param("ei") episodeIndex: number,
    @Body() body: AddEpisodeTvDto
  ) {
    return this.tvsService.addEpisode(
      mediaId,
      seasonIndex,
      episodeIndex,
      body.filePath
    );
  }
}
