import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "./shared/decorators/public.decorator";

@ApiTags("App")
@Controller()
export class AppController {
  @Public()
  @Get("health")
  @ApiOperation({ summary: "[Public] Check if the server is alive" })
  getHealth(): string {
    return "HollyFilms API is up and running";
  }
}
