import { Module } from "@nestjs/common"
import { FilesHandlerService } from "./files.handler.service"

@Module({
  providers: [FilesHandlerService],
  exports: [FilesHandlerService]
})
export class FilesModule {}
