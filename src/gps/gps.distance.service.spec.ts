import { Test, TestingModule } from "@nestjs/testing"
import { GpsDistanceService } from "./gps.distance.service"
import { GpsModule } from "./gps.module"

describe("GpsController", () => {
  let gpsDistanceService: GpsDistanceService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [GpsModule],
      providers: [GpsDistanceService]
    }).compile()

    gpsDistanceService = app.get<GpsDistanceService>(GpsDistanceService)
  })

  describe(" (GPS SERVICE)", () => {
    it("should return distance between 2 geo locations", () => {
      gpsDistanceService.distance(
        {
          latitude: 52.986375,
          longitude: -6.043701
        },
        {
          latitude: 53.339428,
          longitude: -6.257664
        }
      )
    })
  })
})
