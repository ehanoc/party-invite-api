import { Module } from "@nestjs/common"
import { PartyController } from "./party.controller"
import { GpsModule } from "../gps/gps.module"
import { FilesModule } from "../files/files.module"
import { GpsDistanceService } from "../gps/gps.distance.service"
import { MulterModule } from "@nestjs/platform-express"
import { ConfigModule } from "@nestjs/config"
import multer from "multer"

@Module({
  imports: [
    GpsModule,
    FilesModule,
    ConfigModule.forRoot(),
    MulterModule.register({
      storage: multer.memoryStorage()
    })
  ],
  controllers: [PartyController],
  providers: [GpsDistanceService]
})
export class PartyModule {}
