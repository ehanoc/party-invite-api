import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  OnModuleInit,
  HttpException
} from "@nestjs/common"
import { GpsDistanceService } from "../gps/gps.distance.service"
import { ApiConsumes, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger"
import { FileInterceptor } from "@nestjs/platform-express"
import { Attendee } from "./types/attendee"
import { ConfigService } from "@nestjs/config"
import { GeoPoint } from "../gps/types/geo.point"
import { FilesHandlerService } from "../files/files.handler.service"

@ApiTags("Party")
@Controller()
export class PartyController implements OnModuleInit {
  private officeLocation: GeoPoint
  private radiusInvitationTheshold: number

  constructor(
    private gpsDistance: GpsDistanceService,
    private fileshandler: FilesHandlerService,
    private configService: ConfigService
  ) {}

  onModuleInit() {
    this.officeLocation = {
      longitude: this.configService.get<number>("OFFICE_LONGITUDE"),
      latitude: this.configService.get<number>("OFFICE_LATITUDE")
    }

    this.radiusInvitationTheshold = this.configService.get<number>(
      "OFFICE_INVITATION_THRESHOLD"
    )
  }

  @Post(`attendees/available`)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary"
        }
      }
    }
  })
  @ApiResponse({ status: 422, description: "Unable to process file" })
  @ApiResponse({ status: 201, description: "OK" })
  @ApiResponse({ status: 500, description: "Whoops! Call 911" })
  @UseInterceptors(FileInterceptor("file"))
  attendeesToInvite(@UploadedFile("file") file): Attendee[] {
    if (!file) throw new HttpException("Couldnt read file", 422)

    const result: Attendee[] = this.fileshandler
      .parseFileBuffer<Attendee>(file.buffer, "\n", this.isOfAttendee)
      .filter(e => this.isOfAttendee(e))
      .filter(attendee =>
        this.isWithinDistance(
          attendee,
          this.officeLocation,
          this.radiusInvitationTheshold
        )
      )
      .sort((a, b) => a.user_id - b.user_id)

    return result
  }

  /**
   *
   * @param attendee  - Attendee model; includes GPS coordinates
   * @param target - GPS coordinates
   * @param radius - number representing radius distance threshold in KM
   *
   * @returns - returns true if attendee is within [distance]Km of [target]
   */
  private isWithinDistance(
    attendee: Attendee,
    target: GeoPoint,
    radius: number
  ): boolean {
    const distance: number = this.gpsDistance.distance(
      {
        latitude: Number.parseFloat(attendee.latitude),
        longitude: Number.parseFloat(attendee.longitude)
      },
      target
    )

    return distance <= radius
  }

  /**
   * Type guard. JS run-time doesn't do type checks by default.
   * 
   * @param obj - object to validate as type of Attendee
   */
  private isOfAttendee(obj: any): obj is Attendee {
    return (
      (obj as Attendee).user_id !== undefined &&
      (obj as Attendee).name !== undefined &&
      (obj as Attendee).longitude !== undefined &&
      (obj as Attendee).latitude !== undefined
    )
  }
}
