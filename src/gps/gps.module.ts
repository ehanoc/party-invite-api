import { Module } from "@nestjs/common"
import { GpsDistanceService } from "./gps.distance.service"

@Module({
  providers: [GpsDistanceService],
  exports: [GpsDistanceService]
})
export class GpsModule {}
