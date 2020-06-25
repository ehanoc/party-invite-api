import { Module } from "@nestjs/common"
import { GpsModule } from "./gps/gps.module"
import { PartyModule } from "./party/party.module"

@Module({
  imports: [PartyModule],
  controllers: [],
  providers: []
})
export class AppModule {}
