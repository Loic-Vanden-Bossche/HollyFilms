import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Query,
  Res,
} from "@nestjs/common";

import { MediasService } from "./medias.service";

import { Response } from "express";
import { Roles } from "../shared/decorators/roles.decorator";
import { User } from "../shared/decorators/user.decorator";
import CurrentUser from "../indentity/users/current";
import { Role } from "../shared/role";
import { MediaWithType } from "./medias.utils";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MediasQueryDto } from "./dto/medias.query.dto";
import { SearchQueryDto } from "./dto/search.query.dto";
import { checkObjectId } from "../shared/mongoose";
import { Public } from "../shared/decorators/public.decorator";
import { Location } from "./medias.service";

@ApiTags("Medias")
@Controller("medias")
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Roles(Role.User)
  @Get()
  @ApiOperation({ summary: "[User] Get all medias sorted by titles" })
  async getMedias(
    @User() user: CurrentUser,
    @Query() query: MediasQueryDto
  ): Promise<MediaWithType[]> {
    return this.mediasService.getMedias(
      true,
      user,
      query.type,
      parseInt(query.skip, 10),
      parseInt(query.limit, 10)
    );
  }

  @Roles(Role.User)
  @Get("categories")
  @ApiOperation({ summary: "[User] Get all categories" })
  async getAllCategories() {
    return this.mediasService.getCategories();
  }

  @Roles(Role.User)
  @Get("category/*")
  @ApiOperation({ summary: "[User] Get medias for categories" })
  async getMediasByCategories(@Param() categories: string[]) {
    return this.mediasService.getMediasByCategories(categories[0].split("/"));
  }

  @Roles(Role.User)
  @Get("search")
  @ApiOperation({ summary: "[User] Get all medias corresponding to query" })
  async getSearchQuery(
    @Query() query: SearchQueryDto
  ): Promise<MediaWithType[]> {
    return this.mediasService.searchQuery(query.query, true);
  }

  @Roles(Role.Admin)
  @Get("admin")
  @ApiOperation({ summary: "[User] Get all medias in admin mode" })
  async getAdminMedias(): Promise<MediaWithType[]> {
    return this.mediasService.getAdminMedias();
  }

  @Roles(Role.User)
  @Get("featured")
  @ApiOperation({ summary: "[User] Get n of featured medias" })
  async getFeatured(@User() user: CurrentUser) {
    return this.mediasService.getFeatured(user);
  }

  @Public()
  @Get("showcase")
  @ApiOperation({ summary: "[User] Get all minified medias" })
  async getShowcase() {
    return this.mediasService.getShowcaseMedias();
  }

  @Roles(Role.Admin)
  @Get("updateAll")
  @ApiOperation({ summary: "[Admin] Update all medias with new values" })
  updateAllMedias() {
    return this.mediasService.updateAllMedias();
  }

  @Roles(Role.User)
  @Get(":id")
  @ApiOperation({ summary: "[User] Get a specific media by id" })
  async getMedia(@Param("id") id: string) {
    return this.mediasService.getMedia(checkObjectId(id));
  }

  @Roles(Role.Admin)
  @Delete(":id")
  @ApiOperation({ summary: "[Admin] Delete a specific media by id" })
  async deleteMedia(@Param("id") id: string) {
    return this.mediasService.deleteMedia(checkObjectId(id));
  }

  @Roles(Role.User)
  @Get("search/:query")
  @ApiOperation({ summary: "[User] Search for medias" })
  async searchQuery(@Param("query") query: string): Promise<MediaWithType[]> {
    return this.mediasService.searchQuery(query);
  }

  @Roles(Role.User)
  @Get("stream/:location/*")
  @ApiOperation({ summary: "[User] Stream media file" })
  async getStream(
    @Param("location") location: Location,
    @Param() path: string[],
    @Res() res: Response,
    @Headers("accept-encoding") encodingHeader: string
  ): Promise<void> {
    return this.mediasService.getStream(res, location, path[0], encodingHeader);
  }
}
